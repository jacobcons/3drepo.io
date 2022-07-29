/**
 *  Copyright (C) 2021 3D Repo Ltd
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Crypto = require('crypto');
const amqp = require('amqplib');
const http = require('http');

const { src, srcV4 } = require('./path');

const { createApp: createServer } = require(`${srcV4}/services/api`);
const { createApp: createFrontend } = require(`${srcV4}/services/frontend`);
const { io: ioClient } = require('socket.io-client');

const { EVENTS, ACTIONS } = require(`${src}/services/chat/chat.constants`);
const DbHandler = require(`${src}/handler/db`);
const EventsManager = require(`${src}/services/eventsManager/eventsManager`);
const QueueHandler = require(`${src}/handler/queue`);
const config = require(`${src}/utils/config`);
const { templates } = require(`${src}/utils/responseCodes`);
const { createTeamSpaceRole } = require(`${srcV4}/models/role`);
const { generateUUID, UUIDToString, stringToUUID } = require(`${src}/utils/helper/uuids`);
const { PROJECT_ADMIN, TEAMSPACE_ADMIN } = require(`${src}/utils/permissions/permissions.constants`);
const { deleteIfUndefined } = require(`${src}/utils/helper/objects`);
const FilesManager = require('../../../src/v5/services/filesManager');

const { USERS_DB_NAME, AVATARS_COL_NAME } = require(`${src}/models/users.constants`);
const { fieldTypes, presetModules } = require(`${src}/schemas/tickets/templates.constants`);

const db = {};
const queue = {};
const ServiceHelper = { db, queue, socket: {} };

queue.purgeQueues = async () => {
	try {
		// eslint-disable-next-line
		const { host, worker_queue, model_queue, callback_queue } = config.cn_queue;
		const conn = await amqp.connect(host);
		const channel = await conn.createChannel();

		channel.on('error', () => {});

		await Promise.all([
			channel.purgeQueue(worker_queue),
			channel.purgeQueue(model_queue),
			channel.purgeQueue(callback_queue),
		]);
	} catch (err) {
		// doesn't really matter if purge queue failed. it's just for clean up.
	}
};

// userCredentials should be the same format as the return value of generateUserCredentials
db.createUser = (userCredentials, tsList = [], customData = {}) => {
	const { user, password, apiKey, basicData = {} } = userCredentials;
	const roles = tsList.map((ts) => ({ db: ts, role: 'team_member' }));
	return DbHandler.createUser(user, password, { ...basicData, ...customData, apiKey }, roles);
};

db.createTeamspaceRole = (ts) => createTeamSpaceRole(ts);

// breaking = create a broken schema for teamspace to trigger errors for testing
db.createTeamspace = (teamspace, admins = [], breaking = false, customData) => {
	const permissions = admins.map((adminUser) => ({ user: adminUser, permissions: TEAMSPACE_ADMIN }));
	return Promise.all([
		ServiceHelper.db.createUser({ user: teamspace, password: teamspace }, [],
			{ permissions: breaking ? undefined : permissions, ...customData }),
		ServiceHelper.db.createTeamspaceRole(teamspace),
	]);
};

db.createProject = (teamspace, _id, name, models = [], admins = []) => {
	const project = {
		_id: stringToUUID(_id),
		name,
		models,
		permissions: admins.map((user) => ({ user, permissions: [PROJECT_ADMIN] })),
	};

	return DbHandler.insertOne(teamspace, 'projects', project);
};

db.createModel = (teamspace, _id, name, props) => {
	const settings = {
		_id,
		name,
		...props,
	};
	return DbHandler.insertOne(teamspace, 'settings', settings);
};

db.createRevision = async (teamspace, modelId, revision) => {
	if (revision.rFile) {
		const refId = revision.rFile[0];
		await FilesManager.storeFile(teamspace, `${modelId}.history.ref`, refId, revision.refData);
	}
	const formattedRevision = { ...revision, _id: stringToUUID(revision._id) };
	delete formattedRevision.refData;
	await DbHandler.insertOne(teamspace, `${modelId}.history`, formattedRevision);
};

db.createGroups = (teamspace, modelId, groups = []) => {
	const toInsert = groups.map((entry) => {
		const converted = {
			...entry,
			_id: stringToUUID(entry._id),
		};

		if ((entry.objects || []).length) {
			converted.objects = entry.objects.map((objectEntry) => {
				const convertedObj = { ...objectEntry };
				if (objectEntry.shared_ids) {
					convertedObj.shared_ids = objectEntry.shared_ids.map(UUIDToString);
				}
				return convertedObj;
			});
		}

		return converted;
	});

	return DbHandler.insertMany(teamspace, `${modelId}.groups`, toInsert);
};

db.createTemplates = (teamspace, data = []) => {
	const toInsert = data.map((entry) => {
		const converted = {
			...entry,
			_id: stringToUUID(entry._id),
		};
		return converted;
	});

	return DbHandler.insertMany(teamspace, 'templates', toInsert);
};

db.createJobs = (teamspace, jobs) => DbHandler.insertMany(teamspace, 'jobs', jobs);

db.createIssue = (teamspace, modelId, issue) => {
	const formattedIssue = { ...issue, _id: stringToUUID(issue._id) };
	return DbHandler.insertOne(teamspace, `${modelId}.issues`, formattedIssue);
};

db.createRisk = (teamspace, modelId, risk) => {
	const formattedRisk = { ...risk, _id: stringToUUID(risk._id) };
	return DbHandler.insertOne(teamspace, `${modelId}.risks`, formattedRisk);
};

db.createViews = (teamspace, modelId, views) => {
	const formattedViews = views.map((view) => ({ ...view, _id: stringToUUID(view._id) }));
	return DbHandler.insertMany(teamspace, `${modelId}.views`, formattedViews);
};

db.createLegends = (teamspace, modelId, legends) => {
	const formattedLegends = legends.map((legend) => ({ ...legend, _id: stringToUUID(legend._id) }));
	return DbHandler.insertMany(teamspace, `${modelId}.sequences.legends`, formattedLegends);
};

db.createMetadata = (teamspace, modelId, metadataId, metadata) => DbHandler.insertOne(teamspace, `${modelId}.scene`,
	{ _id: stringToUUID(metadataId), type: 'meta', metadata });

db.createAvatar = async (username, type, avatarData) => {
	const { defaultStorage } = config;
	config.defaultStorage = type;
	await FilesManager.storeFile(USERS_DB_NAME, AVATARS_COL_NAME, username, avatarData);
	config.defaultStorage = defaultStorage;
};

ServiceHelper.sleepMS = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
ServiceHelper.generateUUIDString = () => UUIDToString(generateUUID());
ServiceHelper.generateUUID = () => generateUUID();
ServiceHelper.generateRandomString = (length = 20) => Crypto.randomBytes(Math.ceil(length / 2.0)).toString('hex').substring(0, length);
ServiceHelper.generateRandomBuffer = (length = 20) => Buffer.from(ServiceHelper.generateRandomString(length));
ServiceHelper.generateRandomDate = (start = new Date(2018, 1, 1), end = new Date()) => new Date(start.getTime()
    + Math.random() * (end.getTime() - start.getTime()));
ServiceHelper.generateRandomNumber = (min = -1000, max = 1000) => Math.random() * (max - min) + min;

ServiceHelper.generateUserCredentials = () => ({
	user: ServiceHelper.generateRandomString(),
	password: ServiceHelper.generateRandomString(),
	apiKey: ServiceHelper.generateRandomString(),
	basicData: {
		firstName: ServiceHelper.generateRandomString(),
		lastName: ServiceHelper.generateRandomString(),
		billing: {
			billingInfo: {
				company: ServiceHelper.generateRandomString(),
				countryCode: 'GB',
			},
		},
	},
});

ServiceHelper.generateRandomProject = (projectAdmins = []) => ({
	id: ServiceHelper.generateUUIDString(),
	name: ServiceHelper.generateRandomString(),
	permissions: projectAdmins.map(({ user }) => ({ user, permissions: ['admin_project'] })),
});

ServiceHelper.generateRandomModel = ({ isFederation, viewers, commenters, collaborators, properties = {} } = {}) => {
	const permissions = [];
	if (viewers?.length) {
		permissions.push(...viewers.map((user) => ({ user, permission: 'viewer' })));
	}

	if (commenters?.length) {
		permissions.push(...commenters.map((user) => ({ user, permission: 'commenter' })));
	}

	if (collaborators?.length) {
		permissions.push(...collaborators.map((user) => ({ user, permission: 'collaborator' })));
	}

	return {
		_id: ServiceHelper.generateUUIDString(),
		name: ServiceHelper.generateRandomString(),
		properties: {
			...ServiceHelper.generateRandomModelProperties(),
			...(isFederation ? { federate: true } : {}),
			...properties,
			permissions,
		},
	};
};

ServiceHelper.generateRevisionEntry = (isVoid = false, hasFile = true) => {
	const _id = ServiceHelper.generateUUIDString();
	const entry = {
		_id,
		tag: ServiceHelper.generateRandomString(),
		author: ServiceHelper.generateRandomString(),
		timestamp: ServiceHelper.generateRandomDate(),
		void: !!isVoid,
	};

	if (hasFile) {
		entry.rFile = [`${_id}${ServiceHelper.generateUUIDString()}`];
		entry.refData = ServiceHelper.generateRandomString();
	}

	return entry;
};

ServiceHelper.generateRandomModelProperties = (isFed = false) => ({
	properties: {
		code: ServiceHelper.generateRandomString(),
		unit: 'm',
	},
	desc: ServiceHelper.generateRandomString(),
	...(isFed ? { federate: true } : { type: ServiceHelper.generateRandomString() }),
	status: 'ok',
	surveyPoints: [
		{
			position: [
				ServiceHelper.generateRandomNumber(),
				ServiceHelper.generateRandomNumber(),
				ServiceHelper.generateRandomNumber(),
			],
			latLong: [
				ServiceHelper.generateRandomNumber(),
				ServiceHelper.generateRandomNumber(),
			],
		},
	],
	angleFromNorth: 123,
	defaultView: ServiceHelper.generateUUIDString(),
	defaultLegend: ServiceHelper.generateUUIDString(),
});

ServiceHelper.generateTemplate = (deprecated) => ({
	_id: ServiceHelper.generateUUIDString(),
	name: ServiceHelper.generateRandomString(),
	properties: [
		{
			name: ServiceHelper.generateRandomString(),
			type: fieldTypes.TEXT,
		},
		{
			name: ServiceHelper.generateRandomString(),
			type: fieldTypes.TEXT,
			deprecated: true,
		},
		{
			name: ServiceHelper.generateRandomString(),
			type: fieldTypes.NUMBER,
			default: ServiceHelper.generateRandomNumber(),
		},
	],
	modules: [
		{
			type: presetModules.SHAPES,
			deprecated: true,
			properties: [],
		},
		{
			name: ServiceHelper.generateRandomString(),
			properties: [
				{
					name: ServiceHelper.generateRandomString(),
					type: fieldTypes.TEXT,
				},
				{
					name: ServiceHelper.generateRandomString(),
					type: fieldTypes.NUMBER,
					default: ServiceHelper.generateRandomNumber(),
					deprecated: true,
				},
				{
					name: ServiceHelper.generateRandomString(),
					type: fieldTypes.NUMBER,
					default: ServiceHelper.generateRandomNumber(),
				},
			],
		},
	],
	...deleteIfUndefined({ deprecated }),
});

ServiceHelper.generateGroup = (account, model, isSmart = false, isIfcGuids = false, serialised = true) => {
	const genId = () => (serialised ? ServiceHelper.generateUUIDString() : generateUUID());
	const group = {
		_id: genId(),
		name: ServiceHelper.generateRandomString(),
		color: [1, 1, 1],
		createdAt: Date.now(),
		updatedAt: Date.now(),
		updatedBy: ServiceHelper.generateRandomString(),
		author: ServiceHelper.generateRandomString(),
	};

	if (isSmart) {
		group.rules = [
			{
				field: 'IFC GUID',
				operator: 'IS',
				values: [
					'1rbbJcnUDEEA_ArpSqk3B7',
				],
			},
		];
	} else {
		group.objects = [{
			account, model,
		}];

		if (isIfcGuids) {
			group.objects[0].ifc_guids = [
				ServiceHelper.generateRandomString(22),
				ServiceHelper.generateRandomString(22),
				ServiceHelper.generateRandomString(22),
			];
		} else {
			group.objects[0].shared_ids = [genId(), genId(), genId()];
		}
	}

	return group;
};

ServiceHelper.generateView = (account, model, hasThumbnail = true) => ({
	_id: ServiceHelper.generateUUIDString(),
	name: ServiceHelper.generateRandomString(),
	...(hasThumbnail ? { thumbnail: ServiceHelper.generateRandomBuffer() } : {}),
});

ServiceHelper.app = () => createServer().listen(8080);

ServiceHelper.frontend = () => createFrontend().listen(8080);

ServiceHelper.chatApp = () => {
	const server = http.createServer();
	const chatConfig = config.servers.find(({ service }) => service === 'chat');
	server.listen(chatConfig.port, config.hostname);

	// doing a local import as this includes the session service which doesn't clean itself up properly
	// eslint-disable-next-line global-require
	const ChatService = require(`${src}/services/chat`);
	return ChatService.createApp(server);
};

ServiceHelper.loginAndGetCookie = async (agent, user, password, headers = {}) => {
	const res = await agent.post('/v5/login')
		.set(headers)
		.send({ user, password })
		.expect(templates.ok.status);
	const [, cookie] = res.header['set-cookie'][0].match(/connect.sid=([^;]*)/);
	return cookie;
};

ServiceHelper.socket.connectToSocket = (session) => new Promise((resolve, reject) => {
	const { port } = config.servers.find(({ service }) => service === 'chat');
	const socket = ioClient(`http://${config.host}:${port}`,
		{
			path: '/chat',
			transports: ['websocket'],
			reconnection: true,
			reconnectionDelay: 500,
			...(session ? { extraHeaders: { Cookie: `connect.sid=${session}` } } : {}),
		});
	socket.on('connect', () => resolve(socket));
	socket.on('connect_error', reject);
});

ServiceHelper.socket.loginAndGetSocket = async (agent, user, password) => {
	const cookie = await ServiceHelper.loginAndGetCookie(agent, user, password);
	return ServiceHelper.socket.connectToSocket(cookie);
};

ServiceHelper.socket.joinRoom = (socket, data) => new Promise((resolve, reject) => {
	socket.on(EVENTS.MESSAGE, (msg) => {
		expect(msg).toEqual(expect.objectContaining(
			{ event: EVENTS.SUCCESS, data: { action: ACTIONS.JOIN, data } },
		));
		socket.off(EVENTS.MESSAGE);
		socket.off(EVENTS.ERROR);
		resolve();
	});

	socket.on(EVENTS.ERROR, () => {
		socket.off(EVENTS.MESSAGE);
		socket.off(EVENTS.ERROR);
		reject();
	});
	socket.emit('join', data);
});

ServiceHelper.closeApp = async (server) => {
	await DbHandler.disconnect();
	if (server) await server.close();
	EventsManager.reset();
	QueueHandler.close();
};

module.exports = ServiceHelper;
