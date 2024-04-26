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

import { put, select, take, takeLatest } from 'redux-saga/effects';
import { VIEWER_PANELS } from '@/v4/constants/viewerGui';
import { BaseProperties, TicketsCardViews } from '@/v5/ui/routes/viewer/tickets/tickets.constants';
import { ViewerGuiActions } from '@/v4/modules/viewerGui/viewerGui.redux';
import { FetchTicketsListAction, OpenTicketAction, TicketsCardActions, TicketsCardTypes } from './ticketsCard.redux';
import { TicketsActions, TicketsTypes } from '../tickets.redux';
import { DialogsActions } from '../../dialogs/dialogs.redux';
import { formatMessage } from '@/v5/services/intl';
import { selectTemplates } from '../tickets.selectors';

export function* openTicket({ ticketId }: OpenTicketAction) {
	yield put(TicketsCardActions.setSelectedTicket(ticketId));
	yield put(TicketsCardActions.setCardView(TicketsCardViews.Details));
	yield put(ViewerGuiActions.setPanelVisibility(VIEWER_PANELS.TICKETS, true));
}

export function* fetchTicketsList({ teamspace, projectId, modelId, isFederation }: FetchTicketsListAction) {
	try {
		yield put(TicketsActions.fetchTemplates(teamspace, projectId, modelId, isFederation, true));
		yield take(TicketsTypes.FETCH_TEMPLATES_SUCCESS);
		const templates = yield select(selectTemplates, modelId);
		const requiredProperties = templates.reduce((acc, template) => {
			const configColor = template.config?.pin?.color;
			if (!configColor?.property) return acc;
			const { property: { module, name } } = configColor;
			const path = module ? `${module}.${name}` : name;
			return [...acc, path];
		}, [BaseProperties.DESCRIPTION]);
		yield put(TicketsActions.fetchTickets(teamspace, projectId, modelId, isFederation, requiredProperties));

	} catch (error) {
		yield put(DialogsActions.open('alert', {
			currentActions: formatMessage({ id: 'tickets.fetchTicketsList.error', defaultMessage: 'trying to fetch the tickets list' }),
			error,
		}));
	}
}

export default function* ticketsCardSaga() {
	yield takeLatest(TicketsCardTypes.OPEN_TICKET, openTicket);
	yield takeLatest(TicketsCardTypes.FETCH_TICKETS_LIST, fetchTicketsList);
}
