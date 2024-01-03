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
import FlipPlaneIcon from '@assets/icons/viewer/flip_plane.svg';
import AlignIcon from '@assets/icons/viewer/align.svg';
import ClipSelectionIcon from '@assets/icons/viewer/clip_selection.svg';
import CancelIcon from '@assets/icons/viewer/delete.svg';
import ClearOverridesIcon from '@assets/icons/viewer/clear_overrides.svg';
import EyeHideIcon from '@assets/icons/viewer/eye_hide.svg';
import EyeShowIcon from '@assets/icons/viewer/eye_show.svg';
import EyeIsolateIcon from '@assets/icons/viewer/eye_isolate.svg';
import { formatMessage } from '@/v5/services/intl';
import { GroupsActionsDispatchers, TreeActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { GroupsHooksSelectors, TicketsCardHooksSelectors, TreeHooksSelectors, ViewerGuiHooksSelectors } from '@/v5/services/selectorsHooks';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Section, Container, ClearButton, ClearIcon } from './sectionToolbar.styles';
import { ToolbarButton } from '../buttons/toolbarButton.component';
import { VIEWER_CLIP_MODES } from '@/v4/constants/viewer';
import { GizmoModeButtons } from '../buttons/buttonOptionsContainer/gizmoModeButtons.component';
import { Viewer } from '@/v4/services/viewer/viewer';

export const SectionToolbar = () => {
	const hasGroupOverrides = GroupsHooksSelectors.selectGroupsColourOverrides()?.length > 0;
	const hasTicketOverrides = !isEmpty(TicketsCardHooksSelectors.selectTicketOverrides());
	const hasOverrides = hasGroupOverrides || hasTicketOverrides;
	const hasHighlightedObjects = !!TreeHooksSelectors.selectFullySelectedNodesIds().length;
	const hasHiddenObjects = TreeHooksSelectors.selectModelHasHiddenNodes();
	const clippingModeActive = ViewerGuiHooksSelectors.selectIsClipEdit();
	const isBoxClippingMode = ViewerGuiHooksSelectors.selectClippingMode() === VIEWER_CLIP_MODES.BOX;
	return (
		<Container>
			<Section hidden={!clippingModeActive}>
				<GizmoModeButtons hidden={!clippingModeActive} />
				<ToolbarButton
					Icon={FlipPlaneIcon}
					hidden={!clippingModeActive || isBoxClippingMode}
					onClick={Viewer.clipToolFlip}
					title={formatMessage({ id: 'viewer.toolbar.icon.flipPlane', defaultMessage: 'Flip Plane' })}
				/>
				<ToolbarButton
					Icon={AlignIcon}
					hidden={!clippingModeActive}
					onClick={Viewer.clipToolRealign}
					title={formatMessage({ id: 'viewer.toolbar.icon.align', defaultMessage: 'Align' })}
				/>
				<ToolbarButton
					Icon={ClipSelectionIcon}
					hidden={!clippingModeActive}
					onClick={Viewer.clipToolClipToSelection}
					title={formatMessage({ id: 'viewer.toolbar.icon.clipToSelection', defaultMessage: 'Clip To Selection' })}
					disabled={!hasHighlightedObjects}
				/>
				<ToolbarButton
					Icon={CancelIcon}
					hidden={!clippingModeActive}
					onClick={Viewer.clipToolDelete}
					title={formatMessage({ id: 'viewer.toolbar.icon.cancel', defaultMessage: 'Cancel' })}
				/>
			</Section>
			<Section hidden={!hasOverrides}>
				<ToolbarButton
					Icon={ClearOverridesIcon}
					hidden={!hasOverrides}
					onClick={GroupsActionsDispatchers.clearColorOverrides}
					title={formatMessage({ id: 'viewer.toolbar.icon.clearOverrides', defaultMessage: 'Clear Overrides' })}
				/>
			</Section>
			<Section hidden={!hasHighlightedObjects && !hasHiddenObjects}>
				<ToolbarButton
					Icon={EyeShowIcon}
					hidden={!hasHiddenObjects}
					onClick={TreeActionsDispatchers.showAllNodes}
					title={formatMessage({ id: 'viewer.toolbar.icon.showAll', defaultMessage: 'Show All' })}
				/>
				<ToolbarButton
					Icon={EyeHideIcon}
					hidden={!hasHighlightedObjects}
					onClick={TreeActionsDispatchers.hideSelectedNodes}
					title={formatMessage({ id: 'viewer.toolbar.icon.hide', defaultMessage: 'Hide' })}
				/>
				<ToolbarButton
					Icon={EyeIsolateIcon}
					hidden={!hasHighlightedObjects}
					onClick={() => TreeActionsDispatchers.isolateSelectedNodes(undefined)}
					title={formatMessage({ id: 'viewer.toolbar.icon.isolate', defaultMessage: 'Isolate' })}
				/>
				<ClearButton
					hidden={!hasHighlightedObjects}
					onClick={() => GroupsActionsDispatchers.clearSelectionHighlights()}
				>
					<ClearIcon />
					<FormattedMessage id="viewer.toolbar.icon.clearSelection" defaultMessage="Clear Selection" />
				</ClearButton>
			</Section>
		</Container>
	);
};
