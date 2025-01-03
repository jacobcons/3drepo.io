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

const { queryOperators } = require('../schemas/tickets/tickets.filters');

const Tickets = {};

Tickets.TICKETS_RESOURCES_COL = 'tickets.resources';

Tickets.operatorToQuery = {
	[queryOperators.EXISTS]: (propertyName) => ({
		[propertyName]: { $exists: true },
	}),
	[queryOperators.NOT_EXISTS]: (propertyName) => ({
		[propertyName]: { $not: { $exists: true } },
	}),
	[queryOperators.EQUALS]: (propertyName, value) => ({
		[propertyName]: { $in: value },
	}),
	[queryOperators.NOT_EQUALS]: (propertyName, value) => ({
		[propertyName]: { $not: { $in: value } },
	}),
	[queryOperators.CONTAINS]: (propertyName, value) => ({
		$or: value.map((val) => ({ [propertyName]: { $regex: val, $options: 'i' } })),
	}),
	[queryOperators.NOT_CONTAINS]: (propertyName, value) => ({
		$nor: value.map((val) => ({ [propertyName]: { $regex: val, $options: 'i' } })),
	}),
	[queryOperators.RANGE]: (propertyName, value) => ({
		$or: [
			{ [propertyName]: { $gte: value[0], $lte: value[1] } },
			{ [propertyName]: { $gte: new Date(value[0]), $lte: new Date(value[1]) } },
		],
	}),
	[queryOperators.NOT_IN_RANGE]: (propertyName, value) => ({
		$nor: [
			{ [propertyName]: { $gte: value[0], $lte: value[1] } },
			{ [propertyName]: { $gte: new Date(value[0]), $lte: new Date(value[1]) } },
		],
	}),
	[queryOperators.GREATER_OR_EQUAL_TO]: (propertyName, value) => ({
		$or: [
			{ [propertyName]: { $gte: value } },
			{ [propertyName]: { $gte: new Date(value) } },
		],
	}),
	[queryOperators.LESSER_OR_EQUAL_TO]: (propertyName, value) => ({
		$or: [
			{ [propertyName]: { $lte: value } },
			{ [propertyName]: { $lte: new Date(value) } },
		],
	}),
};

module.exports = Tickets;
