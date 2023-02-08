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
import { ITicket, ITemplate, NewTicket, IComment } from '@/v5/store/tickets/tickets.types';
import { pick } from 'lodash';
import api from './default';

export const fetchContainerTemplates = async (
	teamspace: string,
	projectId: string,
	containerId: string,
): Promise<FetchTemplatesResponse> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/templates`);
	return data.templates;
};

export const fetchContainerTemplate = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	templateId:string,
): Promise<ITemplate> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/templates/${templateId}`);
	return data;
};

export const fetchFederationTemplates = async (
	teamspace: string,
	projectId: string,
	federationId: string,
): Promise<FetchTemplatesResponse> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/templates`);
	return data.templates;
};

export const fetchFederationTemplate = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	templateId:string,
): Promise<ITemplate> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/templates/${templateId}`);
	return data;
};

export const fetchContainerTickets = async (
	teamspace: string,
	projectId: string,
	containerId: string,
): Promise<FetchTicketsResponse> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets`);
	return data.tickets;
};

export const fetchFederationTickets = async (
	teamspace: string,
	projectId: string,
	federationId: string,
): Promise<FetchTicketsResponse> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets`);
	return data.tickets;
};

export const fetchContainerTicket = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	ticketId: string,
): Promise<ITicket> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/${ticketId}`);
	return data;
};

export const fetchFederationTicket = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticketId: string,
): Promise<ITicket> => {
	const { data } = await api.get(`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/${ticketId}`);
	return data;
};

export const createContainerTicket = async (
	teamspace: string,
	projectId: string,
	containterId: string,
	ticket: NewTicket,
): Promise<CreateTicketResponse> => {
	const { data } = await api.post(`teamspaces/${teamspace}/projects/${projectId}/containers/${containterId}/tickets`, ticket);
	return data;
};

export const createFederationTicket = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticket: NewTicket,
): Promise<CreateTicketResponse> => {
	const { data } = await api.post(`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets`, ticket);
	return data;
};

export const updateContainerTicket = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	ticketId: string,
	ticket: Partial<ITicket>,
) => (
	api.patch(`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/${ticketId}`, ticket)
);

export const updateFederationTicket = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticketId: string,
	ticket: Partial<ITicket>,
) => (
	api.patch(`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/${ticketId}`, ticket)
);

export const fetchRiskCategories = async (
	teamspace: string,
): Promise<FetchRiskCategoriesResponse> => {
	const { data } = await api.get(`teamspaces/${teamspace}/settings/tickets/riskCategories`);
	return data;
};

// comments
export const fetchFederationTicketComments = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticketId: string,
): Promise<FetchTicketCommentsResponse> => {
	const { data } = await api.get(
		`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/${ticketId}/comments`,
	);
	return data;
};

export const fetchContainerTicketComments = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	ticketId: string,
): Promise<FetchTicketCommentsResponse> => {
	const { data } = await api.get(
		`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/${ticketId}/comments`,
	);
	return data;
};

export const fetchFederationTicketComment = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticketId: string,
	commentId: string,
): Promise<Partial<IComment>> => {
	const { data } = await api.get(
		`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/${ticketId}/comments/${commentId}`,
	);
	return data;
};

export const fetchContainerTicketComment = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	ticketId: string,
	commentId: string,
): Promise<Partial<IComment>> => {
	const { data } = await api.get(
		`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/${ticketId}/comments/${commentId}`,
	);
	return data;
};

export const createFederationTicketComment = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticketId: string,
	comment: Partial<IComment>,
): Promise<CreateTicketCommentsResponse> => {
	const { data } = await api.post(
		`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/${ticketId}/comments`,
		pick(comment, ['message', 'images']),
	);
	return data;
};

export const createContainerTicketComment = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	ticketId: string,
	comment: Partial<IComment>,
): Promise<CreateTicketCommentsResponse> => {
	const { data } = await api.post(
		`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/${ticketId}/comments`,
		pick(comment, ['message', 'images']),
	);
	return data;
};

export const deleteFederationTicketComment = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticketId: string,
	commentId: string,
) => (
	api.delete(`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/${ticketId}/comments/${commentId}`)
);

export const deleteContainerTicketComment = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	ticketId: string,
	commentId: string,
) => (
	api.delete(`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/${ticketId}/comments/${commentId}`)
);

export const updateFederationTicketComment = async (
	teamspace: string,
	projectId: string,
	federationId: string,
	ticketId: string,
	commentId: string,
	comment: Partial<IComment>,
) => (
	api.put(
		`teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/tickets/${ticketId}/comments/${commentId}`,
		pick(comment, ['message', 'images']),
	)
);

export const updateContainerTicketComment = async (
	teamspace: string,
	projectId: string,
	containerId: string,
	ticketId: string,
	commentId: string,
	comment: Partial<IComment>,
) => (
	api.put(
		`teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/tickets/${ticketId}/comments/${commentId}`,
		pick(comment, ['message', 'images']),
	)
);

/**
 * Types
 */
type FetchTemplatesResponse = { templates: ITemplate[] };
type FetchTicketsResponse = { tickets: ITicket[] };
type CreateTicketResponse = { _id: string };
type FetchTicketCommentsResponse = { comments: Partial<IComment>[] };
type CreateTicketCommentsResponse = { _id: string };
type FetchRiskCategoriesResponse = { riskCategories: string[] };
