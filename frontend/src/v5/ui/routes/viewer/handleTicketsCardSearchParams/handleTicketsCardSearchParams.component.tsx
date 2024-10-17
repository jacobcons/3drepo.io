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

import { DialogsActionsDispatchers, TicketsCardActionsDispatchers, ViewerGuiActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { TicketsHooksSelectors } from '@/v5/services/selectorsHooks';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { formatMessage } from '@/v5/services/intl';
import { ViewerParams } from '../../routes.constants';
import { useSearchParam } from '../../useSearchParam';
import { VIEWER_PANELS } from '@/v4/constants/viewerGui';

export const HandleTicketsCardSearchParams = () => {
	const { containerOrFederation } = useParams<ViewerParams>();
	const [ticketId, setTicketId] = useSearchParam('ticketId');

	const [queriesRaw, setQueriesParam] = useSearchParam('queries');
	const queries = queriesRaw?.split(',').filter((f) => f);
	const [templateFiltersRaw, setTemplatesParams] = useSearchParam('templates');
	const templateFilters = templateFiltersRaw?.split(',').filter((f) => f);
	const [completedRaw, setCompletedParam] = useSearchParam('completed');
	const completed = completedRaw.toLowerCase() === 'true';

	const tickets = TicketsHooksSelectors.selectTickets(containerOrFederation);
	const templates = TicketsHooksSelectors.selectTemplates(containerOrFederation);
	const hasTicketData = !isEmpty(tickets) && !isEmpty(templates);

	useEffect(() => {
		if (ticketId && hasTicketData) {
			if (!tickets.some(({ _id }) => _id === ticketId)) {
				DialogsActionsDispatchers.open('warning', {
					title: formatMessage({ id: 'openTicketFromUrl.invalidTicketId.title', defaultMessage: 'Ticket not found' }),
					message: formatMessage({ id: 'openTicketFromUrl.invalidTicketId.message', defaultMessage: 'A ticket with this ID could not be found. Ensure that you have the correct URL' }),
				});
				setTicketId('');
				return;
			}
			TicketsCardActionsDispatchers.openTicket(ticketId);
		}
	}, [hasTicketData]);
	
	useEffect(() => {
		if (!templateFilters.length && !queries.length && !completed) return;
		ViewerGuiActionsDispatchers.setPanelVisibility(VIEWER_PANELS.TICKETS, true);
		TicketsCardActionsDispatchers.setTemplateFilters(templateFilters);
		if (queries.length) {
			TicketsCardActionsDispatchers.setQueryFilters(queries);
		}
		if (completed) {
			TicketsCardActionsDispatchers.toggleCompleteFilter();
		}

		setQueriesParam();
		setCompletedParam();
		setTemplatesParams();
	}, [templateFiltersRaw, queriesRaw, completedRaw]);

	return <></>;
};
