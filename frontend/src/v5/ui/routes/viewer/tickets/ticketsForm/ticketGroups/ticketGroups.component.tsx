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

import { formatMessage } from '@/v5/services/intl';
import { Group, IGroupSettingsForm, Viewpoint, ViewpointState } from '@/v5/store/tickets/tickets.types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ViewpointsActions } from '@/v4/modules/viewpoints';
import { TreeActions } from '@/v4/modules/tree';
import { viewpointV5ToV4, convertToV4GroupNodes } from '@/v5/helpers/viewpoint.helpers';
import { cloneDeep } from 'lodash';
import { VIEWER_PANELS } from '@/v4/constants/viewerGui';
import { selectLeftPanels } from '@/v4/modules/viewerGui';
import { selectHiddenGeometryVisible } from '@/v4/modules/tree/tree.selectors';
import { Container, Popper } from './ticketGroups.styles';
import { GroupsAccordion } from './groupsAccordion/groupsAccordion.component';
import { TicketGroupsContextComponent } from './ticketGroupsContext.component';
import { GroupSettingsForm } from './groups/groupActionMenu/groupSettingsForm/groupSettingsForm.component';

const DEFAULT_HIGHLIGHT_COLOR = [255, 255, 255];

interface TicketGroupsProps {
	value?: Viewpoint;
	onChange?: (newvalue) => void;
	onBlur?: () => void;
}

enum OverrideType {
	COLORED,
	HIDDEN,
}

export const TicketGroups = ({ value, onChange, onBlur }: TicketGroupsProps) => {
	const dispatch = useDispatch();
	const [editingOverride, setEditingOverride] = useState<{index:number, type: OverrideType}>({ index: -1, type: OverrideType.COLORED });
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [highlightedGroupType, setHighlightedGroupType] = useState<OverrideType>(OverrideType.COLORED);

	const state: Partial<ViewpointState> = value.state || {};
	const leftPanels = useSelector(selectLeftPanels);
	const isSecondaryCard = leftPanels[0] !== VIEWER_PANELS.TICKETS;
	const store = useStore();

	const handleSetHighlightedIndex = (groupType) => (index) => {
		setHighlightedGroupType(groupType);
		setHighlightedIndex(index);
	};

	const getHighlightedIndex = (groupType) => {
		if (highlightedGroupType !== groupType) return -1;
		return highlightedIndex;
	};

	const onDeleteColoredGroup = (index) => {
		const newVal = cloneDeep(value);
		newVal.state.colored.splice(index, 1);
		onChange?.(newVal);
		if (highlightedIndex === index && highlightedGroupType === 'colored') {
			setHighlightedIndex(-1);
		}
	};

	const onSetEditGroup = (colored:boolean) => (index: number) => {
		const type = colored ? OverrideType.COLORED : OverrideType.HIDDEN;
		setEditingOverride({ index, type });
		setHighlightedIndex(index);
		setHighlightedGroupType(type);
	};

	const onSelectedColoredGroupChange = (colored) => {
		const view = { state: { colored } } as Viewpoint;
		dispatch(ViewpointsActions.setActiveViewpoint(null, null, viewpointV5ToV4(view)));
	};

	const onCancel = () => {
		setEditingOverride({ index: -1, type: OverrideType.COLORED });
	};

	const onSubmit = (overrideValue) => {
		const newVal = cloneDeep(value || {});
		if (!newVal.state) {
			newVal.state = { showDefaultHidden: selectHiddenGeometryVisible(store.getState()) };
		}

		if (editingOverride.type === OverrideType.COLORED) {
			if (!newVal.state.colored) newVal.state.colored = [];
			newVal.state.colored[editingOverride.index] = overrideValue;
		} else {
			if (!newVal.state.hidden) newVal.state.hidden = [];
			newVal.state.hidden[editingOverride.index] = overrideValue;
		}
		onChange?.(newVal);
		onCancel();
	};

	useEffect(() => { setTimeout(() => { onBlur?.(); }, 200); }, [value]);

	useEffect(() => {
		if (highlightedIndex === -1) return () => {};
		const { group, color } = state[highlightedGroupType][highlightedIndex];
		// const objects = convertToV4GroupNodes((override.group as Group).objects);
		// dispatch(TreeActions.selectNodesBySharedIds(objects, (override.color || DEFAULT_HIGHLIGHT_COLOR).map((c) => c / 255)));
		// dispatch(TreeActions.showNodesBySharedIds(objects));
		
		const objects = convertToV4GroupNodes((group as Group).objects);
		dispatch(TreeActions.clearCurrentlySelected());
		dispatch(TreeActions.showNodesBySharedIds(objects));
		dispatch(TreeActions.selectNodesBySharedIds(objects, color.map((c) => c / 255)));

		return () => {
			// dispatch(TreeActions.deselectNodesBySharedIds(objects));
			// dispatch(TreeActions.hideNodesBySharedIds(objects));
			
			dispatch(TreeActions.clearCurrentlySelected());
		}
	}, [highlightedIndex, highlightedGroupType]);

	return (
		<Container onClick={() => setHighlightedIndex(-1)}>
			<TicketGroupsContextComponent
				groupType="colored"
				onDeleteGroup={onDeleteColoredGroup}
				onSelectedGroupsChange={onSelectedColoredGroupChange}
				overrides={state.colored || []}
				onEditGroup={onSetEditGroup(true)}
				highlightedIndex={getHighlightedIndex('colored')}
				setHighlightedIndex={handleSetHighlightedIndex('colored')}
			>
				<GroupsAccordion
					title={formatMessage({ id: 'ticketCard.groups.coloured', defaultMessage: 'Coloured Groups' })}
				/>
			</TicketGroupsContextComponent>
			<TicketGroupsContextComponent
				groupType="hidden"
				overrides={state.hidden || []}
				onEditGroup={onSetEditGroup(false)}
				highlightedIndex={getHighlightedIndex('hidden')}
				setHighlightedIndex={handleSetHighlightedIndex('hidden')}
			>
				<GroupsAccordion
					title={formatMessage({ id: 'ticketCard.groups.hidden', defaultMessage: 'Hidden Groups' })}
				/>
			</TicketGroupsContextComponent>
			<Popper
				open={editingOverride.index !== -1}
				style={{ /* style is required to override the default positioning style Popper gets */
					left: 460,
					top: isSecondaryCard ? 'unset' : 80,
					bottom: isSecondaryCard ? 40 : 'unset',
				}}
			>
				<GroupSettingsForm
					value={value.state?.[((editingOverride.type === OverrideType.COLORED) ? 'colored' : 'hidden')]?.[editingOverride.index] as IGroupSettingsForm}
					onSubmit={onSubmit}
					onCancel={onCancel}
				/>
			</Popper>
		</Container>
	);
};
