/**
 *  Copyright (C) 2023 3D Repo Ltd
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

const { concat } = require('lodash');
const db = require('../handler/db');
const { generateUUID } = require('../utils/helper/uuids');
const { templates } = require('../utils/responseCodes');

const TicketComments = {};
const TICKET_COMMENTS_COL = 'tickets.comments';

const findMany = (ts, query, projection, sort) => db.find(ts, TICKET_COMMENTS_COL, query, projection, sort);
const findOne = (ts, query, projection) => db.findOne(ts, TICKET_COMMENTS_COL, query, projection);
const updateOne = (ts, query, data) => db.updateOne(ts, TICKET_COMMENTS_COL, query, data);
const insertOne = (ts, data) => db.insertOne(ts, TICKET_COMMENTS_COL, data);

TicketComments.getCommentById = async (teamspace, project, model, ticket, _id,
	projection = {
		teamspace: 0,
		project: 0,
		model: 0,
		ticket: 0,
	}) => {
	const comment = await findOne(teamspace, { teamspace, project, model, ticket, _id }, projection);

	if (!comment) {
		throw templates.commentNotFound;
	}

	return comment;
};

TicketComments.getCommentsByTicket = (teamspace, project, model, ticket, projection, sort) => findMany(teamspace,
	{ teamspace, project, model, ticket }, projection, sort);

TicketComments.addComment = async (teamspace, project, model, ticket, commentData, author) => {
	const _id = generateUUID();
	const createdAt = new Date();
	const comment = { _id, ticket, teamspace, project, model, author, createdAt, updatedAt: createdAt, ...commentData };
	await insertOne(teamspace, comment);
	return _id;
};

const getUpdatedComment = (oldComment, updateData) => {
	const updatedAt = new Date();
	const formattedComment = { updatedAt, ...updateData };

	const historyEntry = {
		timestamp: updatedAt,
		...(oldComment.comment ? { comment: oldComment.comment } : {}),
		...(oldComment.images ? { images: oldComment.images } : {}),
	};

	formattedComment.history = concat(oldComment.history ?? [], [historyEntry]);

	return formattedComment;
};

TicketComments.updateComment = async (teamspace, oldComment, updateData) => {
	const formattedComment = getUpdatedComment(oldComment, updateData);
	await updateOne(teamspace, { _id: oldComment._id }, { $set: { ...formattedComment } });
};

TicketComments.deleteComment = async (teamspace, oldComment) => {
	const formattedComment = getUpdatedComment(oldComment, { deleted: true });
	await updateOne(teamspace, { _id: oldComment._id },
		{ $set: { ...formattedComment }, $unset: { comment: 1, images: 1 } });
};

module.exports = TicketComments;
