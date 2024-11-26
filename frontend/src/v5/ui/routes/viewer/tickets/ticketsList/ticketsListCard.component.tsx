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

import { TicketsCardHooksSelectors, TicketsHooksSelectors } from '@/v5/services/selectorsHooks';
import { CardContainer, CardContent } from '@components/viewer/cards/card.styles';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import TicketsIcon from '@assets/icons/outlined/tickets-outlined.svg';
import { EmptyListMessage } from '@controls/dashedContainer/emptyListMessage/emptyListMessage.styles';
import { TicketsList } from './ticketsList.component';
import { NewTicketMenu } from './newTicketMenu/newTicketMenu.component';
import { ViewerParams } from '../../../routes.constants';
import { TicketsCardActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { EllipsisMenu } from '@controls/ellipsisMenu';
import { formatMessage } from '@/v5/services/intl';
import PinIcon from '@assets/icons/filled/ticket_pin-filled.svg';
import { EllipsisMenuItemSwitch } from '@controls/ellipsisMenu/ellipsisMenuItem/ellipsisMenuItemSwitch.component';
import { CardHeader } from '@components/viewer/cards/cardHeader.component';
import { FilterSelection } from '@components/viewer/cards/cardFilters/filtersSelection/tickets/ticketFiltersSelection.component';
import { TicketFiltersContextComponent } from '@components/viewer/cards/tickets/ticketFiltersContext';
import { TicketBaseKeys } from '../tickets.constants';

// TODO - delete this
const defaultFilters = {
	'': {
		'templateId': {
			'templateId': {
				values: ['template id'],
				operator: 'eq',
			},
		},
	},
	[TicketBaseKeys.PROPERTIES]: {
		'createdAt': {
			'pastDate': {
				values: [new Date('12/12/2024')],
				operator: 'eq',
			},
		},
		'property1': {
			'date': {
				values: [new Date('12/12/2024'), new Date('12/20/2024')],
				operator:'rng',
			},
		},
		'property2': {
			'number': {
				values: [4],
				operator: 'eq',
			},
		},
		'assignees': {
			'manyOf': {
				values: ['Ale', 'San', 'Dan'],
				operator: 'ss',
			},
		},
	},
	'module1': {
		'numberOrStringProperty': {
			'number': {
				values: [],
				operator: 'ex',
			},
			// This is
			'text': {
				values: [2, 3],
				operator:'ss',
			},
		},
	},
};

export const TicketsListCard = () => {
	const { containerOrFederation } = useParams<ViewerParams>();
	const tickets = TicketsHooksSelectors.selectTickets(containerOrFederation);
	const readOnly = TicketsCardHooksSelectors.selectReadOnly();
	const isShowingPins = TicketsCardHooksSelectors.selectIsShowingPins();

	const onClickShowPins = () => {
		TicketsCardActionsDispatchers.setIsShowingPins(!isShowingPins);
	};

	return (
		<TicketFiltersContextComponent filters={defaultFilters}>
			<CardContainer>
				<CardHeader
					icon={<TicketsIcon />}
					title={formatMessage({ id: 'viewer.cards.tickets.title', defaultMessage: 'Tickets' })}
					actions={(
						<>
							{!readOnly && (<NewTicketMenu />)}
							<FilterSelection />
							<EllipsisMenu>
								<EllipsisMenuItemSwitch
									icon={<PinIcon />}
									title={formatMessage({ id: 'viewer.cards.tickets.showPins', defaultMessage: 'Show Pins' })}
									active={isShowingPins}
									onClick={onClickShowPins}
								/>
							</EllipsisMenu>
						</>
					)}
				/>
				<CardContent onClick={TicketsCardActionsDispatchers.resetState}>
					{tickets.length ? (
						<TicketsList />
					) : (
						<EmptyListMessage>
							<FormattedMessage id="viewer.cards.tickets.noTickets" defaultMessage="No tickets have been created yet" />
						</EmptyListMessage>
					)}
				</CardContent>
			</CardContainer>
		</TicketFiltersContextComponent>
	);
};
