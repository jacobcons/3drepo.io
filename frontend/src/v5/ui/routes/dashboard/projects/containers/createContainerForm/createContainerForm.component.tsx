/**
 *  Copyright (C) 2021 3D Repo Ltd
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

import React from 'react';
import { formatMessage } from '@/v5/services/intl';
import { FormattedMessage } from 'react-intl';
import { MenuItem } from '@material-ui/core';
import { FormModal } from '@/v5/ui/controls/modal/formModal/formDialog.component';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router';
import { ContainersActionsDispatchers } from '@/v5/services/actionsDispatchers/containersActions.dispatchers';
import { FormInput, Label, FormSelect, LabelGroup } from './createContainerForm.styles';

interface IFormInput {
	name: string;
	unit: string;
	desc: string;
	code: string;
	type: string;
}

const errorMessage = {
	name: {
		required: formatMessage({ id: 'containers.creation.name.error.required', defaultMessage: 'Name is a required field' }),
		maxLength: formatMessage({ id: 'containers.creation.name.error.length', defaultMessage: 'Name is limited to 120 characters' }),
	},
	code: {
		maxLength: formatMessage({ id: 'containers.creation.code.error.length', defaultMessage: 'Code is limited to 50 characters' }),
		pattern: formatMessage({ id: 'containers.creation.code.error.pattern', defaultMessage: 'Code is limited to letters and numbers' }),
	},
};

export const CreateContainerForm = ({ open, close }): JSX.Element => {
	const { register, handleSubmit, formState, reset, formState: { errors } } = useForm<IFormInput>({
		mode: 'onChange',
	});
	const { teamspace, project } = useParams() as { teamspace: string, project: string };
	const onSubmit: SubmitHandler<IFormInput> = (body) => {
		ContainersActionsDispatchers.createContainer(teamspace, project, body);
		close();
	};

	return (
		<FormModal
			title={formatMessage({ id: 'containers.creation.title', defaultMessage: 'Create new Container' })}
			open={open}
			onClickClose={close}
			onSubmit={handleSubmit(onSubmit)}
			confirmLabel={formatMessage({ id: 'containers.creation.ok', defaultMessage: 'Create Container' })}
			isValid={formState.isValid}
		>
			<Label className="required">
				<FormattedMessage id="containers.creation.form.name" defaultMessage="Name" />
			</Label>
			<FormInput
				fullWidth
				error={errors.name}
				helperText={errors.name && errorMessage.name[errors.name?.type]}
				{...register('name', { required: true, maxLength: 120 })}
			/>
			<LabelGroup>
				<Label className="required">
					<FormattedMessage id="containers.creation.form.units" defaultMessage="Units" />
				</Label>
				<FormSelect defaultValue="" autoWidth {...register('unit', { required: true })}>
					<MenuItem value="mm">
						<FormattedMessage id="containers.creation.form.unit.mm" defaultMessage="Millimetres" />
					</MenuItem>
					<MenuItem value="cm">
						<FormattedMessage id="containers.creation.form.unit.cm" defaultMessage="Centimetres" />
					</MenuItem>
					<MenuItem value="dm">
						<FormattedMessage id="containers.creation.form.unit.dm" defaultMessage="Decimetres" />
					</MenuItem>
					<MenuItem value="m">
						<FormattedMessage id="containers.creation.form.unit.m" defaultMessage="Metres" />
					</MenuItem>
					<MenuItem value="ft">
						<FormattedMessage id="containers.creation.form.unit.ft" defaultMessage="Feet and inches" />
					</MenuItem>
				</FormSelect>
			</LabelGroup>

			<LabelGroup>
				<Label className="required">
					<FormattedMessage id="containers.creation.form.category" defaultMessage="Category" />
				</Label>
				<FormSelect defaultValue="" displayEmpty {...register('type', { required: true })}>
					<MenuItem disabled value="">
						<FormattedMessage  id="containers.creation.form.type.uncategorised" defaultMessage="Uncategorised" />
					</MenuItem>
					<MenuItem value="Architectural">
						<FormattedMessage id="containers.creation.form.type.architectural" defaultMessage="Architectural" />
					</MenuItem>
					<MenuItem value="Existing">
						<FormattedMessage id="containers.creation.form.type.existing" defaultMessage="Existing" />
					</MenuItem>
					<MenuItem value="GIS">
						<FormattedMessage id="containers.creation.form.type.gis" defaultMessage="GIS" />
					</MenuItem>
					<MenuItem value="Infrastructure">
						<FormattedMessage id="containers.creation.form.type.infrastructure" defaultMessage="Infrastructure" />
					</MenuItem>
					<MenuItem value="Interior">
						<FormattedMessage id="containers.creation.form.type.interior" defaultMessage="Interior" />
					</MenuItem>
					<MenuItem value="Landscape">
						<FormattedMessage id="containers.creation.form.type.ladscape" defaultMessage="Landscape" />
					</MenuItem>
					<MenuItem value="MEP">
						<FormattedMessage id="containers.creation.form.type.mep" defaultMessage="MEP" />
					</MenuItem>
					<MenuItem value="Mechanical">
						<FormattedMessage id="containers.creation.form.type.mechanical" defaultMessage="Mechanical" />
					</MenuItem>
					<MenuItem value="Structural">
						<FormattedMessage id="containers.creation.form.type.structural" defaultMessage="Structural" />
					</MenuItem>
					<MenuItem value="Survey">
						<FormattedMessage id="containers.creation.form.type.survey" defaultMessage="Survey" />
					</MenuItem>
					<MenuItem value="Other">
						<FormattedMessage id="containers.creation.form.type.other" defaultMessage="Other" />
					</MenuItem>
				</FormSelect>
			</LabelGroup>

			<Label>
				<FormattedMessage id="containers.creation.form.description" defaultMessage="Description" />
			</Label>
			<FormInput fullWidth {...register('desc')} />

			<Label>
				<FormattedMessage id="containers.creation.form.code" defaultMessage="Code" />
			</Label>
			<FormInput
				fullWidth
				error={errors.code}
				helperText={(errors.code) && errorMessage.code[errors.code?.type]}
				{...register('code', {
					maxLength: 50,
					pattern: /^[A-Za-z0-9]+$/,
				})}
			/>
		</FormModal>
	);
};
