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

// TODO - This is almost identical to containerTitle. Can adapt original component and reuse?

import { DashboardListItemTitle } from '@components/dashboard/dashboardList/dashboardListItem/components/dashboardListItemTitle';
import { FixedOrGrowContainerProps } from '@controls/fixedOrGrowContainer';
import { Highlight } from '@controls/highlight';
import { SearchContext } from '@controls/search/searchContext';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { LatestRevision } from '../../../../containers/containersList/latestRevision/latestRevision.component';
import { Drawing } from '@/v5/store/drawings/drawings.types';

interface IDrawingTitle extends FixedOrGrowContainerProps {
	drawing: Drawing;
	isSelected?: boolean;
}

export const DrawingTitle = ({
	drawing,
	isSelected = false,
	...props
}: IDrawingTitle): JSX.Element => {
	const { query } = useContext(SearchContext);
	const hasRevisions = drawing.revisionsCount > 0;
	const canLaunchDrawing = drawing.hasStatsPending || hasRevisions;

	return (
		<DashboardListItemTitle
			{...props}
			subtitle={!drawing.hasStatsPending && (
				<LatestRevision
					name={(
						<Highlight search={query}>
							{drawing.latestRevision}
						</Highlight>
					)}
					status={drawing.status}
					error={drawing.errorReason}
					hasRevisions={hasRevisions}
				/>
			)}
			selected={isSelected}
			tooltipTitle={canLaunchDrawing ? (
				<FormattedMessage id="drawings.list.item.title.tooltip" defaultMessage="Launch latest revision" />
			) : (
				<FormattedMessage id="drawings.list.item.title.tooltip.empty" defaultMessage="No revisions" />
			)
			}
			disabled={!canLaunchDrawing}
		>
			{/* TODO - add open drawing functionality */}
			<Highlight search={query}>
				{drawing.name}
			</Highlight>
		</DashboardListItemTitle>
	);
};
