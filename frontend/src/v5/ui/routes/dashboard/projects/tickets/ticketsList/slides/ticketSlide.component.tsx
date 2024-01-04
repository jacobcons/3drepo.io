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

import { Loader } from '@/v4/routes/components/loader/loader.component';
import { dirtyValues, filterErrors, nullifyEmptyObjects, removeEmptyObjects } from '@/v5/helpers/form.helper';
import { TicketsActionsDispatchers, TicketsCardActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { enableRealtimeContainerUpdateTicket, enableRealtimeFederationUpdateTicket } from '@/v5/services/realtime/ticket.events';
import { TicketsHooksSelectors } from '@/v5/services/selectorsHooks';
import { modelIsFederation, sanitizeViewVals, templateAlreadyFetched } from '@/v5/store/tickets/tickets.helpers';
import { ITemplate } from '@/v5/store/tickets/tickets.types';
import { getValidators } from '@/v5/store/tickets/tickets.validators';
import { DashboardTicketsParams } from '@/v5/ui/routes/routes.constants';
import { TicketForm } from '@/v5/ui/routes/viewer/tickets/ticketsForm/ticketForm.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty, set } from 'lodash';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

type TicketSlideProps = {
	ticketId: string,
	template: ITemplate,
};
export const TicketSlide = ({ template, ticketId }: TicketSlideProps) => {
	const { teamspace, project, containerOrFederation } = useParams<DashboardTicketsParams>();
	const isFederation = modelIsFederation(containerOrFederation);
	const ticket = TicketsHooksSelectors.selectTicketByIdRaw(containerOrFederation, ticketId);
	const templateValidationSchema = getValidators(template);

	const formData = useForm({
		resolver: yupResolver(templateValidationSchema),
		mode: 'onChange',
		defaultValues: ticket,
	});

	const onBlurHandler = async () => {
		const dirtyFields = formData.formState.dirtyFields;
		if (isEmpty(dirtyFields)) return;

		const formValues = formData.getValues();
		let errors = {};
		try {
			// cannot use formState.errors because the validation for complex objects is completed after
			// onBlur gets called, so formState.errors for those objects is updated to the previous
			// onBlur call instead and might claim there are no errors when it's not the case
			await templateValidationSchema.validateSync(formValues, { abortEarly: false });
		} catch (yupError) {
			(yupError?.inner || []).forEach(({ path, message }) => set(errors, path, { message }));
		}
		const values = dirtyValues(formValues, dirtyFields);
		const validVals = removeEmptyObjects(nullifyEmptyObjects(filterErrors(values, errors)));
		sanitizeViewVals(validVals, ticket, template);
		if (isEmpty(validVals)) return;
		TicketsActionsDispatchers.updateTicket(teamspace, project, containerOrFederation, ticketId, validVals, isFederation);
	};

	useEffect(() => {
		formData.reset(ticket);
	}, [ticket]);

	useEffect(() => {
		if (!containerOrFederation) return;
		TicketsActionsDispatchers.fetchTicket(
			teamspace,
			project,
			containerOrFederation,
			ticketId,
			isFederation,
		);
		TicketsCardActionsDispatchers.setSelectedTicket(ticketId);
	}, [ticketId, containerOrFederation]);

	useEffect(() => {
		return isFederation
			? enableRealtimeFederationUpdateTicket(teamspace, project, containerOrFederation)
			: enableRealtimeContainerUpdateTicket(teamspace, project, containerOrFederation);
	}, [containerOrFederation]);

	useEffect(() => () => {
		onBlurHandler();
	}, []);

	if (!templateAlreadyFetched(template) || !ticket || !containerOrFederation) return (<Loader />);

	return (
		<FormProvider {...formData}>
			<TicketForm template={template} ticket={ticket} onPropertyBlur={onBlurHandler} />
		</FormProvider>
	);
};
