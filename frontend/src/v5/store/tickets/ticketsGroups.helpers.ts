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

import { isString } from 'lodash';
import { GroupState } from '@/v5/ui/routes/viewer/tickets/ticketsForm/ticketGroups/ticketGroupsContext.helper';
import { Group, GroupOverride, ViewpointState, Properties } from './tickets.types';

const overrideWithGroups = (groups: Record<string, Group>) => (override: GroupOverride) => {
	const overrideToReturn = { ...override };
	if (isString(override.group) && groups[override.group]) {
		overrideToReturn.group = groups[override.group];
	}
	return overrideToReturn;
};

const createStateWithGroup = (state: ViewpointState, groups: Record<string, Group>) => {
	const stateToReturn = { ...state };

	if (state.colored) {
		stateToReturn.colored = stateToReturn.colored.map(overrideWithGroups(groups));
	}

	if (state.transformed) {
		stateToReturn.transformed = stateToReturn.transformed.map(overrideWithGroups(groups));
	}

	if (state.hidden) {
		stateToReturn.hidden = stateToReturn.hidden.map(overrideWithGroups(groups));
	}

	return stateToReturn;
};

/* eslint-disable no-param-reassign */
export const createPropertiesWithGroups = (properties, groups) => Object.keys(properties).reduce((partialProps, key) => {
	if (properties[key]?.state) {
		partialProps[key] = {
			...properties[key],
			state: createStateWithGroup(properties[key].state, groups),
		};
	} else {
		partialProps[key] = properties[key];
	}

	return partialProps;
}, {} as Properties);
/* eslint-enable no-param-reassign */

export const getCollectionCheckboxState = (state: GroupState) => {
	switch (state) {
		case null:
			return { checked: false };
		case GroupState.INDETERMINATE:
			return { checked: false, indeterminate: true };
		default:
			return { checked: state === GroupState.CHECKED };
	}
};
