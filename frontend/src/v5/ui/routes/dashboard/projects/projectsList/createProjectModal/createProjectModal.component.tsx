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
import { useEffect, useState } from 'react';
import { formatMessage } from '@/v5/services/intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormModal } from '@controls/modal/formModal/formDialog.component';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProjectsActionsDispatchers } from '@/v5/services/actionsDispatchers/projectsActions.dispatchers';
import { CreateProjectSchema } from '@/v5/validation/projectSchemes/projectsSchemes';
import { FormTextField } from '@controls/formTextField/formTextField.component';
import { FormSelect } from '@controls/formSelect/formSelect.component';
import { MenuItem } from '@mui/material';
import { TeamspacesHooksSelectors } from '@/v5/services/selectorsHooks/teamspacesSelectors.hooks';
import { projectAlreadyExists } from '@/v5/validation/errors.helpers';
import { UnhandledErrorInterceptor } from '@controls/errorMessage/unhandledErrorInterceptor/unhandledErrorInterceptor.component';

interface ICreateProject {
	open: boolean;
	onClickClose: () => void;
}

interface IFormInput {
	projectName: string;
	teamspace: string;
}

export const CreateProjectForm = ({ open, onClickClose }: ICreateProject) => {
	const teamspaces = TeamspacesHooksSelectors.selectTeamspaces();
	const currentTeamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();

	const [alreadyExistingProjectsByTeamspace, setAlreadyExistingProjectsByTeamspace] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const DEFAULT_VALUES = {
		teamspace: currentTeamspace,
		projectName: '',
	};

	const {
		control,
		formState,
		formState: { errors, touchedFields },
		reset,
		watch,
		handleSubmit,
		getValues,
		trigger,
	} = useForm<IFormInput>({
		mode: 'onChange',
		resolver: yupResolver(CreateProjectSchema),
		context: { alreadyExistingProjectsByTeamspace },
		defaultValues: DEFAULT_VALUES,
	});

	const onSubmissionError = (error) => {
		if (projectAlreadyExists(error)) {
			const { projectName, teamspace } = getValues();
			setAlreadyExistingProjectsByTeamspace({
				...alreadyExistingProjectsByTeamspace,
				[teamspace]: [
					...(alreadyExistingProjectsByTeamspace[teamspace] || []),
					projectName,
				],
			});
		}
	};

	const onSubmit: SubmitHandler<IFormInput> = () => {
		setIsSubmitting(true);
		const { teamspace, projectName } = getValues();
		ProjectsActionsDispatchers.createProject(teamspace, projectName.trim(), onClickClose, onSubmissionError);
		setIsSubmitting(false);
	};

	useEffect(() => {
		reset(DEFAULT_VALUES);
		setAlreadyExistingProjectsByTeamspace({});
	}, [open]);

	useEffect(() => {
		if (Object.keys(alreadyExistingProjectsByTeamspace).length) trigger('projectName');
	}, [errors, JSON.stringify(alreadyExistingProjectsByTeamspace)]);

	useEffect(() => {
		ProjectsActionsDispatchers.fetch(getValues('teamspace'));
		if (touchedFields.projectName) {
			trigger('projectName');
		}
	}, [watch('teamspace')]);

	return (
		<FormModal
			title={formatMessage({ id: 'projects.creation.title', defaultMessage: 'Create new Project' })}
			open={open}
			onClickClose={onClickClose}
			onSubmit={handleSubmit(onSubmit)}
			confirmLabel={formatMessage({ id: 'projects.creation.ok', defaultMessage: 'Create Project' })}
			isValid={formState.isValid}
			isSubmitting={isSubmitting}
			maxWidth="sm"
		>
			<FormSelect
				required
				name="teamspace"
				label={formatMessage({ id: 'projects.creation.form.teamspace', defaultMessage: 'Teamspace' })}
				control={control}
			>
				{teamspaces.map((ts) => (
					<MenuItem key={ts.name} value={ts.name}>
						{ts.name}
					</MenuItem>
				))}
			</FormSelect>
			<FormTextField
				required
				name="projectName"
				label={formatMessage({ id: 'projects.creation.form.name', defaultMessage: 'Project name' })}
				control={control}
				formError={errors.projectName}
			/>
			<UnhandledErrorInterceptor expectedErrorValidators={[projectAlreadyExists]} />
		</FormModal>
	);
};
