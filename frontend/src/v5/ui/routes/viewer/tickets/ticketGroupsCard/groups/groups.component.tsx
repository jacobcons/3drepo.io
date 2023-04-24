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

import EditIcon from '@assets/icons/outlined/edit-outlined.svg';
import ShowIcon from '@assets/icons/outlined/eye-outlined.svg';
import HideIcon from '@assets/icons/outlined/eye_disabled-outlined.svg';
import DeleteIcon from '@assets/icons/outlined/delete-outlined.svg';
import { IGroupFromApi, IGroupCollection } from '@/v5/store/tickets/groups/ticketGroups.types';
import { useState } from 'react';
import { DialogsActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { formatMessage } from '@/v5/services/intl';
import { groupBy, partition, keys, values } from 'lodash';
import { rgbaToHex } from '@/v4/helpers/colors';
import { FormattedMessage } from 'react-intl';
import { GroupIconComponent } from '../../../groups/groupItem/groupIcon/groupIcon.component';
import { ErrorTicketButton, PrimaryTicketButton } from '../../ticketButton/ticketButton.styles';
import {
	Name,
	GroupsCount,
	NameContainer,
	GroupCollectionAccordion,
	GroupTitle,
	GroupCollectionContainer,
	GroupItemContainer,
	GroupItemButtons,
	GroupCollectionTitle,
} from './groups.styles';
import { GroupToggle } from './groupToggle/groupToggle.component';

type GroupProps = { group: IGroupFromApi, color?: [number, number, number], opacity?: number, colored: boolean };
const GroupItem = ({ group, color, opacity, colored }: GroupProps) => {
	const [groupIsVisible, setGroupIsVisible] = useState(false);

	const deleteGroup = () => {
		DialogsActionsDispatchers.open('delete', {
			name: group.name,
			onClickConfirm: () => {},
			message: formatMessage({
				id: 'deleteModal.groups.message',
				defaultMessage: 'By deleting this Collection your data will be lost permanently and will not be recoverable.',
			}),
		});
	};

	const toggleShowGroup = () => {
		setGroupIsVisible(!groupIsVisible);
	};

	const editGroup = () => {};

	const alphaColor = (color || [255, 255, 255]).concat(opacity);
	const alphaHexColor = rgbaToHex(alphaColor.join());

	return (
		<GroupItemContainer>
			<GroupTitle>
				<GroupIconComponent rules={group.rules} color={alphaHexColor} />
				<NameContainer>
					<Name>{group.name}</Name>
					<GroupsCount>
						<FormattedMessage
							id="groups.item.numberOfMeshes"
							defaultMessage="{count, plural, =0 {No objects} one {# object} other {# objects}}"
							// values={{ count: group.totalSavedMeshes }}
							values={{ count: group.objects.length }}
						/>
					</GroupsCount>
				</NameContainer>
				{colored && (
					<GroupItemButtons>
						<ErrorTicketButton onClick={deleteGroup}>
							<DeleteIcon />
						</ErrorTicketButton>
						<PrimaryTicketButton onClick={toggleShowGroup}>
							{groupIsVisible ? (<ShowIcon />) : (<HideIcon />)}
						</PrimaryTicketButton>
						<PrimaryTicketButton onClick={editGroup}>
							<EditIcon />
						</PrimaryTicketButton>
					</GroupItemButtons>
				)}
			</GroupTitle>
			<GroupToggle colored={colored} />
		</GroupItemContainer>
	);
};

type GroupCollectionProps = { groups: IGroupCollection[], previousGroupLength: number, colored: boolean };
const GroupCollection = ({ groups, previousGroupLength, colored }: GroupCollectionProps) => {
	const title = groups[0].prefix[0];
	const nextPrefixGroups = groups.map(({ prefix, ...group }) => ({
		...group,
		prefix: prefix.slice(1),
	}));

	return (
		<GroupCollectionAccordion
			title={(
				<GroupCollectionTitle>
					<NameContainer>
						<Name>{title}-{previousGroupLength}</Name>
					</NameContainer>
					<GroupToggle colored={colored} onClick={(e) => e.stopPropagation()} />
				</GroupCollectionTitle>
			)}
		>
			<GroupCollectionContainer>
				<Groups groups={nextPrefixGroups} colored={colored} />
			</GroupCollectionContainer>
		</GroupCollectionAccordion>
	);
};

type GroupsProps = { groups: IGroupCollection[], colored: boolean };
export const Groups = ({ groups, colored }: GroupsProps) => {
	const [groupBatches, groupItems] = partition(groups, (g) => g.prefix?.length);
	const collectionsDict = groupBy(groupBatches, (g) => g.prefix[0]);
	const collections = values(collectionsDict);
	const groupsByPrefix = groupBy(groups, 'prefix');
	const groupsByPrefixIndices = keys(groupsByPrefix);

	return (
		<>
			{groupItems.map((group) => (<GroupItem {...group} colored={colored} />))}
			{collections.map((collection, index) => (
				<GroupCollection
					colored={colored}
					groups={collection}
					previousGroupLength={groupsByPrefix[groupsByPrefixIndices[index]].length}
				/>
			))}
		</>
	);
};
