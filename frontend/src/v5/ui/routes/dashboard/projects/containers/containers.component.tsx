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

import React from 'react';
import { DashboardListEmptyText } from '@components/dashboard/dashboardList/dasboardList.styles';
import { Trans } from '@lingui/react';
import AddCircleIcon from '@assets/icons/add_circle.svg';
import { ContainersHooksSelectors } from '@/v5/services/selectorsHooks/containersSelectors.hooks';
import {
	Container,
	Content,
	NewContainerButton,
} from './containers.styles';
import { ContainersList } from './containersList';
import { EmptySearchResults } from './containersList/emptySearchResults';

export const Containers = (): JSX.Element => {
	const filteredContainers = ContainersHooksSelectors.selectFilteredContainers();
	const favouriteContainers = ContainersHooksSelectors.selectFilteredFavouriteContainers();
	const filterQuery = ContainersHooksSelectors.selectFilterQuery();
	const hasContainers = ContainersHooksSelectors.selectHasContainers();

	return (
		<Container>
			<Content>
				<ContainersList
					containers={favouriteContainers}
					title={(
						<Trans
							id="containers.favourites.collapseTitle"
							message="Favourites ({count})"
							values={{ count: favouriteContainers.length }}
						/>
					)}
					titleTooltips={{
						collapsed: <Trans id="containers.favourites.collapse.tooltip.show" message="Show favourites" />,
						visible: <Trans id="containers.favourites.collapse.tooltip.hide" message="Hide favourites" />,
					}}
					emptyMessage={
						filterQuery && hasContainers.favourites ? (
							<EmptySearchResults searchPhrase={filterQuery} />
						) : (
							<DashboardListEmptyText>
								<Trans
									id="containers.favourites.emptyMessage"
									message="You haven’t added any Favourites. Click the star on a container to add your first favourite Container."
								/>
							</DashboardListEmptyText>
						)
					}
				/>
				<ContainersList
					containers={filteredContainers}
					title={(
						<Trans
							id="containers.all.collapseTitle"
							message="All containers ({count})"
							values={{ count: filteredContainers.length }}
						/>
					)}
					titleTooltips={{
						collapsed: <Trans id="containers.all.collapse.tooltip.show" message="Show all" />,
						visible: <Trans id="containers.all.collapse.tooltip.hide" message="Hide all" />,
					}}
					emptyMessage={
						filterQuery && hasContainers.all ? (
							<EmptySearchResults searchPhrase={filterQuery} />
						) : (
							<>
								<DashboardListEmptyText>
									<Trans id="containers.all.emptyMessage" message="You haven’t created any Containers." />
								</DashboardListEmptyText>
								<NewContainerButton startIcon={<AddCircleIcon />}>
									<Trans id="containers.all.newContainer" message="New Container" />
								</NewContainerButton>
							</>
						)
					}
				/>
			</Content>
		</Container>
	);
};
