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

const Models = {};
const { SETTINGS_COL, getInfoFromCode, modelTypes } = require('./modelSettings.constants');
const db = require('../handler/db');
const { deleteIfUndefined } = require('../utils/helper/objects');
const { events } = require('../services/eventsManager/eventsManager.constants');
const { generateUUIDString } = require('../utils/helper/uuids');
const { publish } = require('../services/eventsManager/eventsManager');
const { templates } = require('../utils/responseCodes');

const findAndDeleteOneModel = (ts, query, projection) => db.findOneAndDelete(ts, SETTINGS_COL, query, projection);
const findOneModel = (ts, query, projection) => db.findOne(ts, SETTINGS_COL, query, projection);
const findModels = (ts, query, projection, sort) => db.find(ts, SETTINGS_COL, query, projection, sort);
const insertOneModel = (ts, data) => db.insertOne(ts, SETTINGS_COL, data);
const updateOneModel = (ts, query, action) => db.updateOne(ts, SETTINGS_COL, query, action);
const findOneAndUpdateModel = (ts, query, action, projection) => db.findOneAndUpdate(
	ts, SETTINGS_COL, query, action, { projection },
);

const noFederations = { federate: { $ne: true } };
const noDrawings = { modelType: { $ne: modelTypes.DRAWING } };
const onlyFederations = { federate: true };

const getModelType = (model) => {
	if (model.modelType) {
		return model.modelType;
	}

	if (model.federate) {
		return modelTypes.FEDERATION;
	}

	return modelTypes.CONTAINER;
};

Models.findModels = findModels;

Models.addModel = async (teamspace, project, data) => {
	const _id = generateUUIDString();
	await insertOneModel(teamspace, { ...data, _id });

	const modelType = getModelType(data);
	const eventData = { ...deleteIfUndefined({
		name: data.name,
		number: modelType === modelTypes.DRAWING ? data.number : undefined,
		unit: modelType === modelTypes.DRAWING ? undefined : data.properties?.unit,
		code: modelType === modelTypes.DRAWING ? undefined : data.properties?.code,
		desc: modelType === modelTypes.FEDERATION ? data.desc : undefined,
		type: modelType === modelTypes.FEDERATION ? undefined : data.type,
	}) };

	publish(events.NEW_MODEL, { teamspace,
		project,
		model: _id,
		data: eventData,
		modelType });

	return _id;
};

Models.deleteModel = async (teamspace, project, model) => {
	const deletedModel = await findAndDeleteOneModel(teamspace, { _id: model }, { federate: 1, modelType: 1 });

	if (!deletedModel) {
		throw templates.modelNotFound;
	}

	publish(events.DELETE_MODEL, { teamspace, project, model, modelType: getModelType(deletedModel) });
};

Models.getModelByQuery = async (ts, query, projection) => {
	const res = await findOneModel(ts, query, projection);

	if (!res) {
		throw templates.modelNotFound;
	}

	return res;
};

Models.getModelById = (ts, model, projection) => Models.getModelByQuery(ts, { _id: model }, projection);

Models.isFederation = async (ts, model) => {
	const { federate } = await Models.getModelById(ts, model, { _id: 0, federate: 1 });
	return federate;
};

Models.getContainerById = async (ts, container, projection) => {
	try {
		return await Models.getModelByQuery(ts, { _id: container, ...noFederations, ...noDrawings }, projection);
	} catch (err) {
		if (err?.code === templates.modelNotFound.code) {
			throw templates.containerNotFound;
		}

		throw err;
	}
};

Models.getDrawingById = async (ts, drawing, projection) => {
	try {
		return await Models.getModelByQuery(ts,
			{ _id: drawing, modelType: modelTypes.DRAWING }, projection);
	} catch (err) {
		if (err?.code === templates.modelNotFound.code) {
			throw templates.drawingNotFound;
		}

		throw err;
	}
};

Models.getFederationById = async (ts, federation, projection) => {
	try {
		return await Models.getModelByQuery(ts, { _id: federation, ...onlyFederations }, projection);
	} catch (err) {
		if (err?.code === templates.modelNotFound.code) {
			throw templates.federationNotFound;
		}
		throw err;
	}
};

Models.getContainers = (ts, ids, projection, sort) => {
	const query = { _id: { $in: ids }, ...noFederations, ...noDrawings };
	return findModels(ts, query, projection, sort);
};

Models.getFederations = (ts, ids, projection, sort) => {
	const query = { _id: { $in: ids }, ...onlyFederations };
	return findModels(ts, query, projection, sort);
};

Models.getDrawings = (ts, ids, projection, sort) => {
	const query = { _id: { $in: ids }, modelType: modelTypes.DRAWING };
	return findModels(ts, query, projection, sort);
};

Models.updateModelStatus = async (teamspace, project, model, status, corId) => {
	const query = { _id: model };
	const updateObj = { status };
	if (corId) {
		updateObj.corID = corId;
	}

	const modelData = await findOneAndUpdateModel(teamspace, query, { $set: updateObj }, { federate: 1, modelType: 1 });
	if (modelData) {
	// It's possible that the model was deleted whilst there's a process in the queue. In that case we don't want to
	// trigger notifications.

		publish(events.MODEL_SETTINGS_UPDATE, { teamspace,
			project,
			model,
			data: { status },
			modelType: getModelType(modelData) });
	}
};

Models.newRevisionProcessed = async (teamspace, project, model, corId, retVal, user, containers) => {
	const { success, message, userErr } = getInfoFromCode(retVal);
	const query = { _id: model };
	const set = {};
	const unset = { corID: 1 };

	if (success) {
		unset.status = 1;
		set.timestamp = new Date();
		if (containers) {
			/* LEGACY DATA: Project is container id here.
			 *  containers used to be called models in v4, and models used to be called
			 *  projects. This data came from 3drepobouncer, which still calls containers projects.
			 */
			set.subModels = containers.map(({ project: _id, group }) => deleteIfUndefined({ _id, group }));
		}
	} else {
		set.status = 'failed';
		set.errorReason = { message, timestamp: new Date(), errorCode: retVal };
	}

	const updated = await updateOneModel(teamspace, query, { $set: set, $unset: unset });
	if (updated) {
	// It's possible that the model was deleted whilst there's a process in the queue. In that case we don't want to
	// trigger notifications.

		// only sent for v4 compatibility
		publish(events.MODEL_IMPORT_FINISHED,
			{ teamspace,
				model,
				success,
				message,
				userErr,
				corId,
				errCode: retVal,
				user });

		const data = { ...set, status: set.status || 'ok' };
		if (data.subModels) {
			data.containers = data.subModels;
			delete data.subModels;
		}

		publish(events.MODEL_SETTINGS_UPDATE, { teamspace,
			project,
			model,
			data,
			modelType: containers ? modelTypes.FEDERATION : modelTypes.CONTAINER });

		if (success) {
			publish(events.NEW_REVISION, { teamspace,
				project,
				model,
				revision: corId,
				modelType: containers ? modelTypes.FEDERATION : modelTypes.CONTAINER });
		}
	}
};

Models.updateModelSettings = async (teamspace, project, model, data) => {
	const toUpdate = {};
	const toUnset = {};

	Object.keys(data).forEach((key) => {
		const value = data[key];
		if (value !== undefined && value !== null) {
			if (key === 'unit' || key === 'code') {
				if (!toUpdate.properties) {
					toUpdate.properties = {};
				}
				toUpdate.properties[key] = value;
			} else {
				toUpdate[key] = value;
			}
		} else if (key === 'defaultView') {
			toUnset[key] = 1;
		}
	});

	const updateJson = {};
	if (Object.keys(toUpdate).length) {
		updateJson.$set = toUpdate;
	}
	if (Object.keys(toUnset).length) {
		updateJson.$unset = toUnset;
	}

	if (Object.keys(updateJson).length) {
		const result = await findOneAndUpdateModel(teamspace, { _id: model }, updateJson,
			{ federate: 1, modelType: 1 });

		if (!result) {
			throw templates.modelNotFound;
		}

		publish(events.MODEL_SETTINGS_UPDATE, { teamspace,
			project,
			model,
			data,
			modelType: getModelType(result) });
	}
};

Models.removeUserFromAllModels = async (teamspace, user) => {
	await db.updateMany(
		teamspace,
		SETTINGS_COL,
		{ 'permissions.user': user },
		{ $pull: { permissions: { user } } },
	);
};

module.exports = Models;
