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
import { Viewpoint, Group, ViewpointGroupOverrideType, GroupOverride, ViewpointState, V4GroupObjects, OverridesDicts } from '@/v5/store/tickets/tickets.types';
import { getGroupHexColor, rgbaToHex } from '@/v4/helpers/colors';
import { generateViewpoint as generateViewpointV4, getNodesIdsFromSharedIds, toSharedIds } from '@/v4/helpers/viewpoints';
import { formatMessage } from '@/v5/services/intl';
import { dispatch, getState } from '@/v4/modules/store';
import { isEmpty, isString } from 'lodash';
import { Viewer as ViewerService } from '@/v4/services/viewer/viewer';
import { TreeActions } from '@/v4/modules/tree';
import { selectCurrentTeamspace } from '../store/teamspaces/teamspaces.selectors';
import { TicketsCardActionsDispatchers } from '../services/actionsDispatchers';

export const convertToV5GroupNodes = (objects) => objects.map((object) => ({
	container: object.model as string,
	_ids: getNodesIdsFromSharedIds([object]),
}));

export const convertToV4GroupNodes = (objects = []) => objects.map(({ container: model, _ids }) => ({
	account: selectCurrentTeamspace(getState()),
	model,
	shared_ids: toSharedIds(_ids),
}));

const convertToV5GroupOverride = (group: any, type: ViewpointGroupOverrideType): GroupOverride => {
	let description = '';
	let name = '';
	switch (type) {
		case ViewpointGroupOverrideType.COLORED:
			const color = rgbaToHex(group.color.join(','));
			description = formatMessage({ id: 'viewpoint.autogeneratedColoredGroup.description', defaultMessage: 'Autogenerated group from viewer for colour {color}' }, { color });
			name = formatMessage({ id: 'viewpoint.autogeneratedColoredGroup.name', defaultMessage: 'Default {color} group' }, { color });
			break;
		case ViewpointGroupOverrideType.TRANSFORMED:
			description = formatMessage({ id: 'viewpoint.autogeneratedTransformedGroup.description', defaultMessage: 'Autogenerated group from viewer for transform' });
			name = formatMessage({ id: 'viewpoint.autogeneratedTransformedGroup.name', defaultMessage: 'Default transform' });
			break;
		default:
			description = formatMessage({ id: 'viewpoint.autogeneratedHiddenGroup.description', defaultMessage: 'Autogenerated hidden group from viewer' });
			name = formatMessage({ id: 'viewpoint.autogeneratedHiddenGroup.name', defaultMessage: 'Default hidden' });
			break;
	}

	const override:GroupOverride = { group: { description, name } };

	(override.group as Group).objects = convertToV5GroupNodes(group.objects);

	if (group.color) {
		const { color } = group;
		if (color.length > 3) {
			override.opacity = color.pop() / 255;
		}
		override.color = color;
	}

	if (group.opacity) {
		const { opacity } = group;
		override.opacity = opacity;
	}

	return override;
};

export const getViewerState = async () => {
	const { viewpoint: viewpointV4 } = await generateViewpointV4();

	const state: ViewpointState = { showHidden: !viewpointV4.hideIfc };

	if (viewpointV4.override_groups?.length) {
		state.colored = viewpointV4.override_groups.map((group) => convertToV5GroupOverride(group, ViewpointGroupOverrideType.COLORED));
	}

	if (viewpointV4.highlighted_group) {
		state.colored = (state.colored || []).concat(convertToV5GroupOverride(viewpointV4.highlighted_group, ViewpointGroupOverrideType.COLORED));
	}

	if (viewpointV4.hidden_group) {
		state.hidden = [convertToV5GroupOverride(viewpointV4.hidden_group, ViewpointGroupOverrideType.HIDDEN)];
	}

	if (viewpointV4.transformation_groups) {
		state.transformed = viewpointV4.transformation_groups.map((group) => convertToV5GroupOverride(group, ViewpointGroupOverrideType.TRANSFORMED));
	}

	return state;
};

const mergeGroups = (groups: any[]) => ({ objects: groups.flatMap((group) => group.objects) });

const convertToV4Group = (groupOverride: GroupOverride) => {
	const { color, opacity, group: v5Group } = groupOverride;

	if (isString(v5Group)) {
		return { color: [0, 0, 0, 0], objects: [] }; // theres no info yet so I say us an empty group
	}

	const group:any = {
		objects: convertToV4GroupNodes(v5Group?.objects || []),
	};

	if (color) {
		group.color = getGroupHexColor([...color, Math.round((opacity ?? 1) * 255)]);
	}

	if (opacity) {
		group.opacity = opacity;
	}

	return group;
};

export const viewpointV5ToV4 = (viewpoint: Viewpoint) => {
	let v4Viewpoint:any = {};
	if (viewpoint.camera) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { position, up, forward: view_dir, type, size: orthographicSize } = viewpoint.camera;
		v4Viewpoint = { position, up, view_dir, type, orthographicSize, look_at: null, account: null, model: null };
	}

	if (!isEmpty(viewpoint.state)) {
		v4Viewpoint.hideIfc = !viewpoint.state.hidden;
	}

	if (!isEmpty(viewpoint.clippingPlanes)) {
		v4Viewpoint.clippingPlanes = viewpoint.clippingPlanes;
	}

	if (!isEmpty(viewpoint.state?.colored)) {
		v4Viewpoint.override_groups = viewpoint.state.colored.map(convertToV4Group);
	}

	if (!isEmpty(viewpoint.state?.transformed)) {
		v4Viewpoint.transformation_groups = viewpoint.state.transformed.map(convertToV4Group);
	}

	if (!isEmpty(viewpoint.state?.hidden)) {
		v4Viewpoint.hidden_group = mergeGroups(viewpoint.state.hidden.map(convertToV4Group));
	}

	return { viewpoint: v4Viewpoint };
};

export const meshObjectsToV5GroupNode = (objects) => objects.map((obj) => ({
	container: obj.model,
	_ids: obj.mesh_ids,
}));

export const toColorAndTransparencyDicts = (overrides: GroupOverride[]): OverridesDicts => {
	const toMeshDictionary = (objects: V4GroupObjects, color: string, opacity: number): OverridesDicts => objects.shared_ids.reduce((dict, id) => {
		if (color !== undefined) {
			// eslint-disable-next-line no-param-reassign
			dict.overrides[id] = color;
		}

		if (opacity !== undefined) {
			// eslint-disable-next-line no-param-reassign
			dict.transparencies[id] = opacity;
		}
		return dict;
	}, { overrides: {}, transparencies: {} } as OverridesDicts);

	return overrides.reduce((acum, current) => {
		const color = current.color ? getGroupHexColor(current.color) : undefined;
		const { opacity } = current;
		const v4Objects = convertToV4GroupNodes((current.group as Group)?.objects || []);

		return v4Objects.reduce((dict, objects) => {
			const overrideDict = toMeshDictionary(objects, color, opacity);

			// eslint-disable-next-line no-param-reassign
			dict.overrides = { ...dict.overrides, ...overrideDict.overrides };
			// eslint-disable-next-line no-param-reassign
			dict.transparencies = { ...dict.transparencies, ...overrideDict.transparencies };
			return dict;
		}, acum);
	}, { overrides: {}, transparencies: {} } as OverridesDicts);
};

export const goToView = async (view: Viewpoint) => {
	await ViewerService.setViewpoint(view);
	const overrides = toColorAndTransparencyDicts(view?.state?.colored || []);
	TicketsCardActionsDispatchers.setOverrides(overrides);

	if (view?.state) {
		dispatch(TreeActions.setHiddenGeometryVisible(!!view.state.showHidden));
	}

	const v4HiddenObjects = convertToV4GroupNodes(view.state?.hidden?.flatMap((hiddenOverride) => (hiddenOverride.group as Group)?.objects || []));
	if (v4HiddenObjects.length) {
		dispatch(TreeActions.hideNodesBySharedIds(v4HiddenObjects, true));
	} else {
		dispatch(TreeActions.showAllNodes());
	}
};
