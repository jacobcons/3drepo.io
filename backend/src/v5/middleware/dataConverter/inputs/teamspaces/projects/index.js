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

const { createResponseCode, templates } = require('../../../../../utils/responseCodes');
const { UUIDToString } = require('../../../../../utils/helper/uuids');
const Yup = require('yup');
const { getProjectByName, getProjectById } = require('../../../../../models/projectSettings');
const { respond } = require('../../../../../utils/responder');
const { singleImageUpload } = require('../../../multer');
const { types } = require('../../../../../utils/helper/yup');
const { validateMany } = require('../../../../common');

const Projects = {};

Projects.validateProjectData = async (req, res, next) => {
	const schema = Yup.object().shape({
		name: types.strings.title.required().test('check-name-is-unique', 'Project with the same name already exists', async (value) => {
			try {
				const project = await getProjectByName(req.params.teamspace, value, { _id: 1 });
				return UUIDToString(project._id) === UUIDToString(req.params.project);
			} catch {
				return true;
			}
		}),
	}).strict(true).noUnknown();

	try {
		await schema.validate(req.body);
		await next();
	} catch (err) {
		respond(req, res, createResponseCode(templates.invalidArguments, err?.message));
	}
};

Projects.projectExists = async (req, res, next) => {
	try {
		const { teamspace, project } = req.params;
		await getProjectById(teamspace, project, { _id: 1 });

		await next();
	} catch (err) {
		respond(req, res, err);
	}
};

const validateProjectImage = async (req, res, next) => {
	try {
		if (!req.file) throw createResponseCode(templates.invalidArguments, 'A file must be provided');

		await next();
	} catch (err) {
		respond(req, res, createResponseCode(templates.invalidArguments, err?.message));
	}
};

Projects.validateProjectImage = validateMany([singleImageUpload('file'), validateProjectImage]);

module.exports = Projects;
