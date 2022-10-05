/**
 *  Copyright (C) 2022 3D Repo Ltd
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

/**
 * This script is used to remove any incomplete (failed, not processing) revisions.
 * It will go through scenes and remove any revision data associated with revisions
 * that are incomplete and older than 14 days (i.e., unlikely to be queued)
 */

const { v5Path } = require('../../../interop');

const { logger } = require(`${v5Path}/utils/logger`);
const { getTeamspaceList, getCollectionsEndsWith } = require('../../utils');
const Path = require('path');

const TypeChecker = require(`${v5Path}/utils/helper/typeCheck`);

const { deleteMany, find } = require(`${v5Path}/handler/db`);
const { removeFiles } = require(`${v5Path}/handler/gridfs`);
const { removeFilesWithMeta } = require(`${v5Path}/services/filesManager`);
const { UUIDToString } = require(`${v5Path}/utils/helper/uuids`);

const processFilesAndRefs = async (teamspace, collection, filenames = [], filter) => {
	try {
		if (filenames.length > 0) {
			await removeFiles(teamspace, collection, filenames);
		}

		await removeFilesWithMeta(teamspace, collection, filter || { _id: { $in: filenames } });
	} catch (err) {
		logger.logError(err);
	}
};

const removeRecords = async (teamspace, collection, filter, refAttribute) => {
	if (refAttribute) {
		const projection = { [refAttribute]: 1 };
		const filesFilter = { ...filter, [refAttribute]: { $exists: true } };

		const results = await find(teamspace, collection, filesFilter, projection);
		const filenames = [];

		for (const record of results) {
			const fileRefs = record[refAttribute];
			if (fileRefs) {
				if (TypeChecker.isString(fileRefs)) {
					filenames.push(fileRefs);
				} else {
					for (const entry of Object.values(fileRefs)) {
						filenames.push(entry);
					}
				}
			}
		}

		await processFilesAndRefs(teamspace, collection, filenames);
	}

	await deleteMany(teamspace, collection, filter);
};

const processModelStash = async (teamspace, model, revId) => {
	const modelStashPromises = [];

	modelStashPromises.push(processFilesAndRefs(
		teamspace,
		`${model}.stash.json_mpc`,
		undefined,
		{ filename: { $regex: `^/${teamspace}/${model}/revision/${UUIDToString(revId)}/` } },
	));

	modelStashPromises.push(processFilesAndRefs(
		teamspace,
		`${model}.stash.json_mpc.ref`,
		undefined,
		{ _id: { $regex: `^${UUIDToString(revId)}/` } },
	));

	const unity3d = await find(teamspace, `${model}.stash.unity3d`, { _id: revId }, { assets: 1, jsonFiles: 1 });
	for (const { assets, jsonFiles } of unity3d) {
		modelStashPromises.push(processFilesAndRefs(teamspace, `${model}.stash.unity3d.ref`, assets.map((filename) => filename.replace(`/${teamspace}/${model}/`, ''))));
		modelStashPromises.push(processFilesAndRefs(teamspace, `${model}.stash.json_mpc.ref`, jsonFiles.map((filename) => filename.replace(`/${teamspace}/${model}/`, ''))));
		modelStashPromises.push(processFilesAndRefs(teamspace, `${model}.stash.json_mpc.ref`, assets.map((filename) => filename.replace(`/${teamspace}/${model}/`, '').replace('unity3d', 'json.mpc'))));
		modelStashPromises.push(processFilesAndRefs(teamspace, `${model}.stash.src.ref`, assets.map((filename) => filename.replace(`/${teamspace}/${model}/`, '').replace('unity3d', 'src.mpc'))));
	}

	modelStashPromises.push(removeRecords(teamspace, `${model}.stash.unity3d`, { _id: revId }, '_extRef'));
	modelStashPromises.push(removeRecords(teamspace, `${model}.stash.3drepo`, { rev_id: revId }, '_extRef'));

	await Promise.all(modelStashPromises);
};

const processModelSequences = async (teamspace, model, revId) => {
	const sequences = await find(teamspace, `${model}.sequences`, { rev_id: revId }, { frames: 1 });
	const sequenceFilenames = [];

	for (const { _id, frames } of sequences) {
		if (frames) {
			for (const { state } of Object.values(frames)) {
				sequenceFilenames.push(state);
			}
		}

		// eslint-disable-next-line no-await-in-loop
		await Promise.all([
			removeRecords(teamspace, `${model}.activities`, { sequenceId: _id }, '_extRef'),
			processFilesAndRefs(teamspace, `${model}.activities.ref`, undefined, { _id: UUIDToString(_id) }),
		]);
	}

	await processFilesAndRefs(teamspace, `${model}.sequences.ref`, sequenceFilenames);

	await deleteMany(teamspace, `${model}.sequences`, { rev_id: revId });
};

const processModelScene = async (teamspace, model, revId) => {
	await removeRecords(teamspace, `${model}.scene`, { rev_id: revId }, '_extRef');
};

const removeRevision = async (teamspace, model, revId) => {
	logger.logInfo(`\t\t-${model}::${UUIDToString(revId)}`);

	await Promise.all([
		processModelScene(teamspace, model, revId),
		processModelSequences(teamspace, model, revId),
		processModelStash(teamspace, model, revId),
	]);
};

const processTeamspace = async (teamspace, revisionAge) => {
	const cols = await getCollectionsEndsWith(teamspace, '.history');

	for (const { name } of cols) {
		const incompleteRevisionFilter = {
			incomplete: { $exists: true },
			timestamp: { $lt: new Date(new Date().setDate(new Date().getDate() - revisionAge)) },
		};
		// eslint-disable-next-line no-await-in-loop
		const badRevisions = await find(teamspace, name, incompleteRevisionFilter, { rFile: 1 });

		for (const { _id, rFile } of badRevisions) {
			const model = name.slice(0, -('.history'.length));
			// eslint-disable-next-line no-await-in-loop
			await removeRevision(teamspace, model, _id);

			// eslint-disable-next-line no-await-in-loop
			await processFilesAndRefs(teamspace, name, rFile);
			// eslint-disable-next-line no-await-in-loop
			await removeRecords(teamspace, name, incompleteRevisionFilter);
		}
	}
};

const run = async (revisionAge) => {
	logger.logInfo('Finding all members from all teamspaces...');
	const teamspaces = ['charence']; // await getTeamspaceList();
	for (const teamspace of teamspaces) {
		logger.logInfo(`\t-${teamspace}`);
		// eslint-disable-next-line no-await-in-loop
		await processTeamspace(teamspace, revisionAge);
	}
};

const genYargs = (yargs) => {
	const commandName = Path.basename(__filename, Path.extname(__filename));
	const argsSpec = (subYargs) => subYargs.option('revisionAge', {
		describe: 'Days threshold for failed revisions',
		type: 'number',
		default: 14,
	});
	return yargs.command(commandName,
		'Remove any incomplete (failed, not processing) revisions',
		argsSpec,
		(argv) => run(argv.revisionAge));
};

module.exports = {
	run,
	genYargs,
};
