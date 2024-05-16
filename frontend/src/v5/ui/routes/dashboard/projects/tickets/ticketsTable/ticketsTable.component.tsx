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

import { JobsActionsDispatchers, ProjectsActionsDispatchers, TicketsActionsDispatchers, TicketsCardActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { ContainersHooksSelectors, FederationsHooksSelectors, ProjectsHooksSelectors, TicketsHooksSelectors } from '@/v5/services/selectorsHooks';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'react-redux';
import { selectFederationById } from '@/v5/store/federations/federations.selectors';
import { FormattedMessage } from 'react-intl';
import { formatMessage } from '@/v5/services/intl';
import { useParams, generatePath, useHistory } from 'react-router-dom';
import { SearchContextComponent } from '@controls/search/searchContext';
import { ITicket } from '@/v5/store/tickets/tickets.types';
import { selectTicketsHaveBeenFetched } from '@/v5/store/tickets/tickets.selectors';
import ExpandIcon from '@assets/icons/outlined/expand_panel-outlined.svg';
import AddCircleIcon from '@assets/icons/filled/add_circle-filled.svg';
import TickIcon from '@assets/icons/outlined/tick-outlined.svg';
import { CircleButton } from '@controls/circleButton';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import { ThemeProvider as MuiThemeProvider, SelectChangeEvent } from '@mui/material';
import { theme } from '@/v5/ui/routes/viewer/theme';
import { combineSubscriptions } from '@/v5/services/realtime/realtime.service';
import { enableRealtimeContainerNewTicket, enableRealtimeContainerUpdateTicket, enableRealtimeFederationNewTicket, enableRealtimeFederationUpdateTicket } from '@/v5/services/realtime/ticket.events';
import { TicketContextComponent } from '@/v5/ui/routes/viewer/tickets/ticket.context';
import { isCommenterRole } from '@/v5/store/store.helpers';
import { TicketsTableContent } from './ticketsTableContent/ticketsTableContent.component';
import { Transformers, useSearchParam } from '../../../../useSearchParam';
import { DashboardTicketsParams, TICKETS_ROUTE, VIEWER_ROUTE } from '../../../../routes.constants';
import { ContainersAndFederationsSelect } from '../selectMenus/containersAndFederationsFormSelect.component';
import { GroupByFormSelect, GroupBySelect } from '../selectMenus/groupByFormSelect.component';
import { TemplateFormSelect, TemplateSelect } from '../selectMenus/templateFormSelect.component';
import { Link, FiltersContainer, NewTicketButton, SelectorsContainer, SearchInput, SidePanel, SlidePanelHeader, OpenInViewerButton, FlexContainer, CompletedChip } from '../tickets.styles';
import { GROUP_BY_URL_PARAM_TO_TEMPLATE_CASE, NONE_OPTION, hasRequiredViewerProperties } from './ticketsTable.helper';
import { NewTicketMenu } from './newTicketMenu/newTicketMenu.component';
import { NewTicketSlide } from '../ticketsList/slides/newTicketSlide.component';
import { TicketSlide } from '../ticketsList/slides/ticketSlide.component';
import { useSelectedModels } from './newTicketMenu/useSelectedModels';
import { ticketIsCompleted } from '@controls/chip/statusChip/statusChip.helpers';
import { templateAlreadyFetched } from '@/v5/store/tickets/tickets.helpers';

type FormType = {
	containersAndFederations: string[],
	template: string,
};


const paramToInputProps = (value, setter) => ({
	value,
	onChange: (ev: SelectChangeEvent<unknown>) =>  setter((ev.target as HTMLInputElement).value),
});

const NEW_TICKET_ID = 'new';

export const TicketsTable = () => {
	const history = useHistory();
	const params = useParams<DashboardTicketsParams>();
	const { teamspace, project,  template, ticketId } = params;
	const [containersAndFederations, setContainersAndFederations] = useSearchParam('models', Transformers.STRING_ARRAY, true);
	const [showCompleted, setShowCompleted] = useSearchParam('showCompleted', Transformers.BOOLEAN, true);
	const [groupBy, setGroupBy] = useSearchParam('groupBy', undefined, true);

	const [containerOrFederation] = useSearchParam('containerOrFederation');


	const models = useSelectedModels();

	const { getState } = useStore();

	const setTemplate = (newTemplate) => {
		const newParams = { ...params, template: newTemplate };
		const path = generatePath(TICKETS_ROUTE + window.location.search, newParams);
		history.push(path);
	};

	const setTicketId = (modelId,  ticket?: Partial<ITicket>) => {
		const newParams = { ...params, ticketId: ticket?._id };
		const args =  (window.location.search || '?') + '&containerOrFederation=' + modelId;
		const path = generatePath(TICKETS_ROUTE + args, newParams);
		history.push(path);
	};

	useEffect(() => {
		TicketsCardActionsDispatchers.setSelectedTicket(ticketId);
	}, [ticketId]);

	const isNewTicket = (ticketId || '').toLowerCase() === NEW_TICKET_ID;
	const clearTicketId = () => setTicketId(null);


	// const setTemplate = (newTemplate) => {
	// 	const newParams = { ...params, template: newTemplate };
	// 	const path = generatePath(TICKETS_ROUTE + window.location.search, newParams);
	// 	history.push(path);
	// };


	// const formData = useForm<FormType>({
	// 	defaultValues: {
	// 		containersAndFederations: modelsIds,
	// 		template: templateURLParam,
	// 		groupBy: GROUP_BY_URL_PARAM_TO_TEMPLATE_CASE[groupByURLParam] || NONE_OPTION,
	// 	},
	// });


	// const { containersAndFederations, template } = formData.watch();
	// const containersAndFederations = modelsIds;


	const tickets = TicketsHooksSelectors.selectTicketsByContainersAndFederations(containersAndFederations);
	const templates = ProjectsHooksSelectors.selectCurrentProjectTemplates();
	const selectedTemplate = ProjectsHooksSelectors.selectCurrentProjectTemplateById(template);
	// const [sidePanelTicket, setSidePanelTicket] = useState<Partial<ITicket>>(null);
	const [isNewTicketDirty, setIsNewTicketDirty] = useState(false);
	
	const federations = FederationsHooksSelectors.selectFederations();
	const isFederation = (modelId) => federations.some(({ _id }) => _id === modelId);

	const readOnly = isFederation(containerOrFederation)
		? !FederationsHooksSelectors.selectHasCommenterAccess(containerOrFederation)
		: !ContainersHooksSelectors.selectHasCommenterAccess(containerOrFederation);
	
	
	// const selectedTicketId = sidePanelTicket?._id;
	// const isCreatingNewTicket = containerOrFederation && !selectedTicketId && !hasRequiredViewerProperties(selectedTemplate);

	const ticketsFilteredByTemplate = useMemo(() => {
		const ticketsToShow = tickets.filter((t) => ticketIsCompleted(t, selectedTemplate) === showCompleted);
		return ticketsToShow.filter(({ type }) => type === template);
	}, [template, tickets, showCompleted]);
	
	
	const newTicketButtonIsDisabled = false;

	// const newTicketButtonIsDisabled = !containersAndFederations.length || models.filter(({ role }) => isCommenterRole(role)).length === 0;

	// const setSidePanelData = (modelId: string, ticket?: Partial<ITicket>) => {
	// 	const newParams = {
	// 		...params,
	// 		template,
	// 		containerOrFederation: modelId,
	// 	};
	// 	const path = generatePath(TICKETS_ROUTE, newParams);
	// 	history.replace(path + window.location.search);
	// 	setSidePanelTicket(ticket);
	// };

	// const onSaveTicket = (ticketId: string) => setSidePanelTicket({ _id: ticketId });
	// const clearTicketId = () => setSidePanelData(null, null);

	const filterTickets = (items, query: string) => items.filter((ticket) => {
		const templateCode = templates.find(({ _id }) => _id === ticket.type).code;
		const ticketCode = `${templateCode}:${ticket.number}`;

		const elementsToFilter = [ticketCode, ticket.title];
		if (containersAndFederations.length > 1) {
			elementsToFilter.push(ticket.modelName);
		}
		return elementsToFilter.some((str = '') => str.toLowerCase().includes(query.toLowerCase()));
	});

	const getOpenInViewerLink = () => {
		if (!containerOrFederation) return '';

		const pathname = generatePath(VIEWER_ROUTE, {
			teamspace,
			project,
			containerOrFederation: containerOrFederation || '',
		});
		return pathname + (ticketId ? `?ticketId=${ticketId}` : '');
	};

	// We are using getState here because is being used inside a function
	const isFed = (modelId) => !!selectFederationById(getState(), modelId);

	useEffect(() => {
		// setModelsIds(containersAndFederations);
		if (!containersAndFederations.length) return;

		containersAndFederations.forEach((modelId) => {
			if (selectTicketsHaveBeenFetched(getState(), modelId)) return;
			TicketsActionsDispatchers.fetchTickets(teamspace, project, modelId, isFed(modelId));
		});
	}, [containersAndFederations]);

	useEffect(() => {
		const subscriptions = containersAndFederations.flatMap((modelId) => {
			if (isFed(modelId)) {
				return [
					enableRealtimeFederationNewTicket(teamspace, project, modelId),
					enableRealtimeFederationUpdateTicket(teamspace, project, modelId),
				];
			}
			return [
				enableRealtimeContainerNewTicket(teamspace, project, modelId),
				enableRealtimeContainerUpdateTicket(teamspace, project, modelId),
			];
		});
		return combineSubscriptions(...subscriptions);
	}, [containersAndFederations]);

	// useEffect(() => {
	// 	const newURL = generatePath(TICKETS_ROUTE, {
	// 		...params,
	// 		groupBy: _.snakeCase(groupBy),
	// 		template,
	// 	});
	// 	history.push(newURL + window.location.search);
	// }, [groupBy, template]);

	// useEffect(() => () => {
	// 	setModelsIds();
	// 	formData.setValue('containersAndFederations', []);
	// }, [project]);

	// useEffect(() => {
	// 	TicketsCardActionsDispatchers.setSelectedTicket(selectedTicketId);
	// }, [selectedTicketId]);

	useEffect(() => {
		JobsActionsDispatchers.fetchJobs(teamspace);
		TicketsActionsDispatchers.fetchRiskCategories(teamspace);
	}, []);

	useEffect(() => {
		TicketsCardActionsDispatchers.setReadOnly(readOnly);
	}, [readOnly]);

	useEffect(() => {
		if (templates.length) return;

		ProjectsActionsDispatchers.fetchTemplates(teamspace, project);
	}, []);

	useEffect(() => {
		if (templateAlreadyFetched(selectedTemplate)) return;
		ProjectsActionsDispatchers.fetchTemplate(teamspace, project, template);
	}, [template]);

	return (
		<SearchContextComponent items={ticketsFilteredByTemplate} filteringFunction={filterTickets}>
			<FiltersContainer>
				<FlexContainer>
					<SelectorsContainer>
						<ContainersAndFederationsSelect
							isNewTicketDirty={isNewTicketDirty}
							{...paramToInputProps(containersAndFederations, setContainersAndFederations)}
						/>
						<TemplateSelect
							isNewTicketDirty={isNewTicketDirty}
							{...paramToInputProps(template, setTemplate)}
						/>
						<GroupBySelect 
							templateId={template}
							{...paramToInputProps(groupBy || NONE_OPTION, setGroupBy)}
						/>
					</SelectorsContainer>
					<CompletedChip
						icon={<TickIcon />}
						label={formatMessage({ id: 'ticketsTable.filters.completed', defaultMessage: 'Completed' })}
						selected={showCompleted}
						onClick={() => setShowCompleted(!showCompleted)}
					/>
				</FlexContainer>
				<FlexContainer>
					<SearchInput
						placeholder={formatMessage({ id: 'ticketsTable.search.placeholder', defaultMessage: 'Search...' })}
					/>
					<NewTicketMenu
						TriggerButton={(
							<NewTicketButton
								startIcon={<AddCircleIcon />}
								disabled={newTicketButtonIsDisabled}
							>
								<FormattedMessage id="ticketsTable.button.newTicket" defaultMessage="New Ticket" />
							</NewTicketButton>
						)}
						disabled={newTicketButtonIsDisabled}
						onContainerOrFederationClick={setTicketId}
					/>
				</FlexContainer>
			</FiltersContainer>
			<TicketsTableContent setSidePanelData={setTicketId} selectedTicketId={ticketId} />
			<SidePanel open={!!ticketId}>
				<SlidePanelHeader>
					<Link to={getOpenInViewerLink()} target="_blank" disabled={isNewTicket}>
						<OpenInViewerButton disabled={isNewTicket}>
							<FormattedMessage
								id="ticketsTable.button.openIn3DViewer"
								defaultMessage="Open in 3D viewer"
							/>
						</OpenInViewerButton>
					</Link>
					<CircleButton onClick={clearTicketId}>
						<ExpandIcon />
					</CircleButton>
				</SlidePanelHeader>
				{containerOrFederation && (
					<MuiThemeProvider theme={theme}>
						<TicketContextComponent isViewer={false}>
							{!isNewTicket && (<TicketSlide ticketId={ticketId} template={selectedTemplate} />)}
							{isNewTicket && (
								<NewTicketSlide
									defaultValue={sidePanelTicket}
									template={selectedTemplate}
									onSave={onSaveTicket}
									onDirtyStateChange={setIsNewTicketDirty}
								/>
							)}
						</TicketContextComponent>
					</MuiThemeProvider>
				)}
			</SidePanel>
		</SearchContextComponent>
	);
};
