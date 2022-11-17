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

import { ProjectsActionsDispatchers } from '@/v5/services/actionsDispatchers/projectsActions.dispatchers';
import { formatMessage } from '@/v5/services/intl';
import { ProjectsHooksSelectors } from '@/v5/services/selectorsHooks/projectsSelectors.hooks';
import { TeamspacesHooksSelectors } from '@/v5/services/selectorsHooks/teamspacesSelectors.hooks';
import { projectAlreadyExists } from '@/v5/validation/errors.helpers';
import { EditProjectSchema } from '@/v5/validation/projectSchemes/projectsSchemes';
import { UnhandledErrorInterceptor } from '@controls/errorMessage/unhandledErrorInterceptor/unhandledErrorInterceptor.component';
import { FormTextField } from '@controls/formTextField/formTextField.component';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Form, SubmitButton, SuccessMessage } from './projectSettings.styles';

type IFormInput = {
	projectName: string,
};
export const ProjectSettings = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitWasSuccessful, setSubmitWasSuccessful] = useState(false);

	const currentTeamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const currentProject = ProjectsHooksSelectors.selectCurrentProjectDetails();
	const existingNames = ProjectsHooksSelectors.selectCurrentProjects()
		.map((p) => p.name)
		.filter((name) => name !== currentProject.name);

	const defaultValues = currentProject.name ? { projectName: currentProject.name } : undefined;
	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		watch,
		reset,
	} = useForm<IFormInput>({
		mode: 'onChange',
		resolver: yupResolver(EditProjectSchema),
		context: { existingNames },
		defaultValues,
	});

	const onSubmit: SubmitHandler<IFormInput> = ({ projectName }) => {
		setIsSubmitting(true);
		const projectUpdate = { name: projectName.trim() };
		ProjectsActionsDispatchers.updateProject(
			currentTeamspace,
			currentProject._id,
			projectUpdate,
			() => setSubmitWasSuccessful(true),
			() => setSubmitWasSuccessful(false),
		);
		setIsSubmitting(false);
	};

	const nameWasChanged = () => watch('projectName')?.trim() !== currentProject.name;

	useEffect(() => {
		reset(defaultValues);
		setSubmitWasSuccessful(false);
	}, [currentProject]);

	useEffect(() => { ProjectsActionsDispatchers.fetch(currentTeamspace); }, []);

	if (_.isEmpty(currentProject)) return (<></>);

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<FormTextField
					required
					name="projectName"
					label={formatMessage({ id: 'project.settings.form.name', defaultMessage: 'Project name' })}
					control={control}
					formError={errors.projectName}
					disabled={!currentProject.isAdmin}
				/>
				<SubmitButton
					disabled={!nameWasChanged() || !isValid || !currentProject.isAdmin}
					isPending={isSubmitting}
				>
					<FormattedMessage id="project.settings.form.save" defaultMessage="Save" />
				</SubmitButton>
			</Form>
			{submitWasSuccessful && (
				<SuccessMessage>
					<FormattedMessage id="project.settings.form.successMessage" defaultMessage="The project has been updated successfully." />
				</SuccessMessage>
			)}
			<UnhandledErrorInterceptor expectedErrorValidators={[projectAlreadyExists]} />
		</>
	);
};
