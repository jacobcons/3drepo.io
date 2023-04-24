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

import { selectJobs } from '@/v4/modules/jobs';
import { formatMessage } from '@/v5/services/intl';
import { TeamspacesHooksSelectors, UsersHooksSelectors } from '@/v5/services/selectorsHooks';
import { SearchContext, SearchContextComponent, SearchContextType } from '@controls/search/searchContext';
import { NoResults, SearchInputContainer } from '@controls/searchSelect/searchSelect.styles';
import { MenuItem } from '@mui/material';
import { get, partition } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { AssigneesSelectMenuItem } from './assigneesSelectMenuItem/assigneesSelectMenuItem.component';
import { AssigneeListItem } from '../assigneesList/assigneeListItem/assigneeListItem.component';
import { HiddenSelect, HorizontalRule, ListHeading, SearchInput } from './assigneesSelectMenu.styles';

const isUser = (assignee) => get(assignee, 'user');

const preventPropagation = (e) => {
	if (e.key !== 'Escape') {
		e.stopPropagation();
	}
};

export const AssigneesSelectMenu = ({
	open,
	value,
	values,
	onClick,
	...props
}) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const jobs = useSelector(selectJobs);
	const users = UsersHooksSelectors.selectUsersByTeamspace(teamspace);
	const filterItems = (items, query: string) => items
		.filter(({ _id, firstName, lastName, job }) => [_id, firstName, lastName, job]
			.some((string) => string?.toLowerCase().includes(query.toLowerCase())));

	const onClickList = (e) => {
		preventPropagation(e);
		onClick();
	};
	return (
		<SearchContextComponent filteringFunction={filterItems} items={[...jobs, ...users]}>
			<SearchContext.Consumer>
				{ ({ filteredItems }: SearchContextType<typeof MenuItem>) => {
					const [filteredUsers, filteredJobs] = partition(filteredItems, isUser);
					return (
						<HiddenSelect
							open={open}
							value={value}
							multiple
							MenuProps={{
								disableAutoFocusItem: true,
								PaperProps: {
									style: { maxHeight: 531, maxWidth: 218 },
								},
							}}
							onClick={onClickList}
							{...props}
						>
							<SearchInputContainer>
								<SearchInput
									placeholder={formatMessage({ id: 'searchSelect.searchInput.placeholder', defaultMessage: 'Search...' })}
									onClick={preventPropagation}
									onKeyDown={preventPropagation}
								/>
							</SearchInputContainer>
							<ListHeading>
								{formatMessage({ id: 'assigneesSelectMenu.jobsHeading', defaultMessage: 'Jobs' })}
							</ListHeading>
							{filteredJobs.length > 0 && filteredJobs.map(({ _id }) => (
								<AssigneesSelectMenuItem
									key={_id}
									value={_id}
									icon={() => <AssigneeListItem assignee={_id} />}
									title={_id}
								/>
							))}
							{!filteredJobs.length && (
								<NoResults>
									<FormattedMessage
										id="form.searchSelect.menuContent.emptyList"
										defaultMessage="No results"
									/>
								</NoResults>
							)}
							<HorizontalRule />
							<ListHeading>
								{formatMessage({ id: 'assigneesSelectMenu.usersHeading', defaultMessage: 'Users' })}
							</ListHeading>
							{filteredUsers.length > 0 && filteredUsers.map(({ user, firstName, lastName, job }) => (
								<AssigneesSelectMenuItem
									key={user}
									value={user}
									icon={() => <AssigneeListItem assignee={user} />}
									title={`${firstName} ${lastName}`}
									subtitle={job}
								/>
							))}
							{!filteredUsers.length && (
								<NoResults>
									<FormattedMessage
										id="form.searchSelect.menuContent.emptyList"
										defaultMessage="No results"
									/>
								</NoResults>
							)}
						</HiddenSelect>
					);
				}}
			</SearchContext.Consumer>
		</SearchContextComponent>
	);
};
