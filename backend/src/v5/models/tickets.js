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

const { deleteIfUndefined, isEqual } = require('../utils/helper/objects');
const { getNestedProperty, setNestedProperty } = require('../utils/helper/objects');
const { isDate, isObject, isUUID } = require('../utils/helper/typeCheck');
const DbHandler = require('../handler/db');
const { basePropertyLabels } = require('../schemas/tickets/templates.constants');
const { generateUUID } = require('../utils/helper/uuids');
const { templates } = require('../utils/responseCodes');

const Tickets = {};
const TICKETS_COL = 'tickets';

const determineTicketNumber = async (teamspace, project, model, type) => {
	const lastTicket = await DbHandler.findOne(teamspace, TICKETS_COL,
		{ teamspace, project, model, type }, { number: 1 }, { number: -1 });
	return (lastTicket?.number ?? 0) + 1;
};

// We expect all tickets to have the same template (i.e. type field should be the same in all tickets provided)
Tickets.addTicketsWithTemplate = async (teamspace, project, model, templateId, tickets) => {
	if (!tickets?.length) return [];

	const response = [];
	const startCounter = await determineTicketNumber(teamspace, project, model, templateId);

	const processedTickets = tickets.map((ticketData, i) => {
		const fullData = { ...ticketData, _id: generateUUID(), number: startCounter + i };
		response.push(fullData);

		return { ...fullData, teamspace, project, model };
	});

	await DbHandler.insertMany(teamspace, TICKETS_COL, processedTickets);

	return response;
};

Tickets.updateManyTickets = async (teamspace, project, model, oldTickets, data, author) => {
	if (!data?.length) return [];

	const changeSet = [];

	const writeOps = data.flatMap((updateData, i) => {
		const oldTicket = oldTickets[i];
		const toUpdate = {};
		const toUnset = {};
		const { modules, properties, ...rootProps } = updateData;
		const changes = {};
		const determineUpdate = (obj, prefix = '') => {
			Object.keys(obj).forEach((key) => {
				const updateObjProp = `${prefix}${key}`;
				const oldValue = getNestedProperty(oldTicket, updateObjProp);
				let newValue = obj[key];
				if (newValue) {
					if (isObject(newValue) && !isDate(newValue) && !isUUID(newValue)) {
					// if this is an object it is a composite type, in which case
					// we should merge the old value with the new value
						newValue = deleteIfUndefined({ ...(oldValue ?? {}), ...newValue }, true);
						if (isEqual(newValue, {})) {
							newValue = null;
							toUnset[updateObjProp] = 1;
						} else {
							toUpdate[updateObjProp] = newValue;
						}
					} else {
						toUpdate[updateObjProp] = newValue;
					}
				} else {
					toUnset[updateObjProp] = 1;
				}

				if (updateObjProp !== `properties.${basePropertyLabels.UPDATED_AT}`) {
					setNestedProperty(changes, `${updateObjProp}.from`, oldValue);
					setNestedProperty(changes, `${updateObjProp}.to`, newValue);
				}
			});
		};

		determineUpdate(rootProps);
		determineUpdate(properties, 'properties.');
		Object.keys(modules).forEach((mod) => {
			determineUpdate(modules[mod], `modules.${mod}.`);
		});

		const actions = {};
		if (!isEqual(toUpdate, {})) actions.$set = toUpdate;
		if (!isEqual(toUnset, {})) actions.$unset = toUnset;

		if (Object.keys(actions).length) {
			changeSet.push({
				ticket: { _id: oldTicket._id, type: oldTicket.type },
				author,
				changes,
				timestamp: updateData.properties[basePropertyLabels.UPDATED_AT],
			});
			return { updateOne: {
				filter: { _id: oldTicket._id },
				update: actions,

			} };
		}

		return [];
	});

	if (writeOps.length) {
		await DbHandler.bulkWrite(teamspace, TICKETS_COL, writeOps);
	}

	return changeSet;
};

Tickets.updateTicket = async (teamspace, project, model, oldTicket, updateData, author) => {
	const [changeSet] = await Tickets.updateManyTickets(teamspace, project, model, [oldTicket], [updateData], author);
	return changeSet;
};
Tickets.removeAllTicketsInModel = async (teamspace, project, model) => {
	await DbHandler.deleteMany(teamspace, TICKETS_COL, { teamspace, project, model });
};

Tickets.getTicketById = async (
	teamspace,
	project,
	model,
	_id,
	projection = { teamspace: 0, project: 0, model: 0 },
) => {
	const ticket = await DbHandler.findOne(teamspace, TICKETS_COL, { teamspace, project, model, _id }, projection);

	if (!ticket) {
		throw templates.ticketNotFound;
	}

	return ticket;
};

Tickets.getTicketsByQuery = (teamspace, project, model, query, projection) => DbHandler.find(teamspace,
	TICKETS_COL, { teamspace, project, model, ...query }, projection);

Tickets.getAllTickets = (
	teamspace,
	project,
	model,
	{
		projection = { teamspace: 0, project: 0, model: 0 },
		updatedSince,
		sort = { [`properties.${basePropertyLabels.Created_AT}`]: -1 },
	} = {},

) => {
	const query = { teamspace, project, model };

	if (updatedSince) {
		query[`properties.${basePropertyLabels.UPDATED_AT}`] = { $gt: updatedSince };
	}

	return DbHandler.find(teamspace, TICKETS_COL, query, projection, sort);
};

module.exports = Tickets;
