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

const { STATUSES, modelTypes } = require('../../../../models/modelSettings.constants');
const { addModel, getModelList } = require('./commons/modelList');
const { addRevision, deleteModelRevisions, getRevisionByIdOrTag, getRevisions, updateRevision, updateRevisionStatus } = require('../../../../models/revisions');
const { appendFavourites, deleteFavourites } = require('./commons/favourites');
const { deleteModel, getDrawingById, getDrawings, updateModelSettings } = require('../../../../models/modelSettings');
const { getFileAsStream, removeFilesWithMeta, storeFile } = require('../../../../services/filesManager');
const { getProjectById, removeModelFromProject } = require('../../../../models/projectSettings');
const { generateUUID } = require('../../../../utils/helper/uuids');
const { templates } = require('../../../../utils/responseCodes');

const Drawings = { };

Drawings.getDrawingList = async (teamspace, project, user) => {
	const { models } = await getProjectById(teamspace, project, { permissions: 1, models: 1 });
	const modelSettings = await getDrawings(teamspace, models, { _id: 1, name: 1, permissions: 1 });

	return getModelList(teamspace, project, user, modelSettings);
};

Drawings.addDrawing = (teamspace, project, data) => addModel(teamspace, project,
	{ ...data, modelType: modelTypes.DRAWING });

Drawings.updateSettings = updateModelSettings;

Drawings.deleteDrawing = async (teamspace, project, drawing) => {
	await removeFilesWithMeta(teamspace, `${modelTypes.DRAWING}s.history.ref`, { model: drawing });

	await Promise.all([
		deleteModelRevisions(teamspace, project, drawing, modelTypes.DRAWING),
		deleteModel(teamspace, project, drawing),
		removeModelFromProject(teamspace, project, drawing),
	]);
};

Drawings.getRevisions = async (teamspace, drawing, showVoid) => {
	const revisions = await getRevisions(teamspace, drawing, modelTypes.DRAWING, showVoid,
		{ _id: 1, author: 1, format: 1, timestamp: 1, statusCode: 1, revCode: 1, void: 1, desc: 1 });

	return revisions;
};

Drawings.newRevision = async (teamspace, project, drawing, data, file) => {
	const format = `.${file.originalname.split('.').splice(-1)[0].toLowerCase()}`;

	const fileId = generateUUID();
	const revId = await addRevision(teamspace, project, drawing, modelTypes.DRAWING,
		{ ...data, format, rFile: [fileId], status: STATUSES.PROCESSING });

	const fileMeta = { name: file.originalname, rid: revId, project, model: drawing };
	await storeFile(teamspace, `${modelTypes.DRAWING}s.history.ref`, fileId, file.buffer, fileMeta);

	await updateRevision(teamspace, drawing, modelTypes.DRAWING, revId, { status: STATUSES.OK });
};

Drawings.updateRevisionStatus = (teamspace, project, drawing, revision, status) => updateRevisionStatus(
	teamspace, project, drawing, modelTypes.DRAWING, revision, status);

Drawings.downloadRevisionFiles = async (teamspace, drawing, revision) => {
	const rev = await getRevisionByIdOrTag(teamspace, drawing, modelTypes.DRAWING, revision, { rFile: 1 });

	if (!rev.rFile?.length) {
		throw templates.fileNotFound;
	}

	return getFileAsStream(teamspace, `${modelTypes.DRAWING}s.history.ref`, rev.rFile[0]);
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
