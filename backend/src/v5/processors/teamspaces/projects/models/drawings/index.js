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

const { STATUSES, modelTypes } = require('../../../../../models/modelSettings.constants');
const { UUIDToString, generateUUID } = require('../../../../../utils/helper/uuids');
const { addModel, getModelList } = require('../commons/modelList');
const { addRevision, deleteModelRevisions, getLatestRevision, getRevisionByIdOrTag, getRevisionCount, getRevisions, updateRevision, updateRevisionStatus } = require('../../../../../models/revisions');
const { appendFavourites, deleteFavourites } = require('../commons/favourites');
const { deleteModel, getDrawingById, getDrawings, updateModelSettings } = require('../../../../../models/modelSettings');
const { getFileAsStream, removeFilesWithMeta, storeFile } = require('../../../../../services/filesManager');
const { getProjectById, removeModelFromProject } = require('../../../../../models/projectSettings');
const { DRAWINGS_HISTORY_COL } = require('../../../../../models/revisions.constants');
const Path = require('path');
const { deleteIfUndefined } = require('../../../../../utils/helper/objects');
const { events } = require('../../../../../services/eventsManager/eventsManager.constants');
const { getCalibrationStatus } = require('../../../../../models/calibrations');
const { publish } = require('../../../../../services/eventsManager/eventsManager');
const { templates } = require('../../../../../utils/responseCodes');

const Drawings = { };

Drawings.getDrawingList = async (teamspace, project, user) => {
	const { models } = await getProjectById(teamspace, project, { permissions: 1, models: 1 });
	const modelSettings = await getDrawings(teamspace, models, { _id: 1, name: 1, permissions: 1 });

	return getModelList(teamspace, project, user, modelSettings);
};

Drawings.getDrawingStats = async (teamspace, project, drawing) => {
	let latestRev;
	let calibration;

	const [settings, revCount] = await Promise.all([
		getDrawingById(teamspace, drawing, { number: 1, status: 1, type: 1, desc: 1 }),
		getRevisionCount(teamspace, drawing, modelTypes.DRAWING),
	]);

	try {
		latestRev = await getLatestRevision(teamspace, drawing, modelTypes.DRAWING,
			{ _id: 1, statusCode: 1, revCode: 1, timestamp: 1 });
		calibration = await getCalibrationStatus(teamspace, drawing, latestRev?._id);
	} catch {
		// do nothing. A drawing can have 0 revision.
	}

	return deleteIfUndefined({
		number: settings.number,
		status: settings.status,
		type: settings.type,
		desc: settings.desc,
		revisions: {
			total: revCount,
			lastUpdated: latestRev?.timestamp,
			latestRevision: latestRev ? `${latestRev.statusCode}-${latestRev.revCode}` : undefined,
		},
		calibration,
	});
};

Drawings.addDrawing = (teamspace, project, data) => addModel(teamspace, project,
	{ ...data, modelType: modelTypes.DRAWING });

Drawings.updateSettings = updateModelSettings;

Drawings.deleteDrawing = async (teamspace, project, drawing) => {
	await removeFilesWithMeta(teamspace, DRAWINGS_HISTORY_COL, { model: drawing });

	await Promise.all([
		deleteModelRevisions(teamspace, project, drawing, modelTypes.DRAWING),
		deleteModel(teamspace, project, drawing),
		removeModelFromProject(teamspace, project, drawing),
	]);
};

Drawings.getRevisions = (teamspace, project, drawing, showVoid) => getRevisions(teamspace, project, drawing,
	modelTypes.DRAWING, showVoid,
	{ _id: 1, author: 1, format: 1, timestamp: 1, statusCode: 1, revCode: 1, void: 1, desc: 1 });

Drawings.newRevision = async (teamspace, project, model, data, file) => {
	try {
		const format = Path.extname(file.originalname).toLowerCase();
		const fileId = generateUUID();

		const rev_id = await addRevision(teamspace, project, model, modelTypes.DRAWING,
			{ ...data, format, rFile: [fileId], status: STATUSES.PROCESSING, incomplete: true });

		publish(events.QUEUED_TASK_UPDATE, { teamspace,
			model,
			corId: UUIDToString(rev_id),
			status: STATUSES.PROCESSING });

		const fileMeta = { name: file.originalname, rev_id, project, model };
		await storeFile(teamspace, `${DRAWINGS_HISTORY_COL}.ref`, fileId, file.buffer, fileMeta);
		await updateRevision(teamspace, model, modelTypes.DRAWING, rev_id, { status: STATUSES.OK }, { incomplete: 1 });

		publish(events.NEW_REVISION, { teamspace,
			project,
			model,
			revision: UUIDToString(rev_id),
			modelType: modelTypes.DRAWING });
	} catch (err) {
		// TODO
	}
};

Drawings.updateRevisionStatus = (teamspace, project, drawing, revision, status) => updateRevisionStatus(
	teamspace, project, drawing, modelTypes.DRAWING, revision, status);

Drawings.downloadRevisionFiles = async (teamspace, drawing, revision) => {
	const rev = await getRevisionByIdOrTag(teamspace, drawing, modelTypes.DRAWING, revision, { rFile: 1 });

	if (!rev.rFile?.length) {
		throw templates.fileNotFound;
	}

	return getFileAsStream(teamspace, `${DRAWINGS_HISTORY_COL}.ref`, rev.rFile[0]);
};

Drawings.appendFavourites = async (username, teamspace, project, favouritesToAdd) => {
	const accessibleDrawings = await Drawings.getDrawingList(teamspace, project, username);
	return appendFavourites(username, teamspace, accessibleDrawings, favouritesToAdd);
};

Drawings.deleteFavourites = async (username, teamspace, project, favouritesToRemove) => {
	const accessibleDrawings = await Drawings.getDrawingList(teamspace, project, username);
	return deleteFavourites(username, teamspace, accessibleDrawings, favouritesToRemove);
};

Drawings.getSettings = (teamspace, drawing) => getDrawingById(teamspace,
	drawing, { name: 1, number: 1, type: 1, desc: 1 });

module.exports = Drawings;
