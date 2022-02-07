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

import React, { useEffect } from 'react';
import { formatMessage } from '@/v5/services/intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@material-ui/core';
import { FormModal } from '@/v5/ui/controls/modal/formModal/formDialog.component';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useParams } from 'react-router';
import { FederationsActionsDispatchers } from '@/v5/services/actionsDispatchers/federationsActions.dispatchers';
import { IFederation, EMPTY_VIEW, IFederationExtraSettings, IFederationSettings } from '@/v5/store/federations/federations.types';
import { FormTextField } from '@controls/formTextField/formTextField.component';
import { FormSelectView } from '@controls/formSelectView/formSelectView.component';
import { FormSelect } from '@controls/formSelect/formSelect.component';
import { FederationSettingsSchema } from '@/v5/validation/schemes';
import { FlexContainer, SectionTitle, UnitTextField, ShareTextField } from './federationSettingsForm.styles';

const UNITS = [
	{
		name: formatMessage({ id: 'units.mm.name', defaultMessage: 'Millimetres' }),
		abbreviation: formatMessage({ id: 'units.mm.abbreviation', defaultMessage: 'mm' }),
	},
	{
		name: formatMessage({ id: 'units.cm.name', defaultMessage: 'Centimetres' }),
		abbreviation: formatMessage({ id: 'units.cm.abbreviation', defaultMessage: 'cm' }),
	},
	{
		name: formatMessage({ id: 'units.dm.name', defaultMessage: 'Decimetres' }),
		abbreviation: formatMessage({ id: 'units.dm.abbreviation', defaultMessage: 'dm' }),
	},
	{
		name: formatMessage({ id: 'units.m.name', defaultMessage: 'Metres' }),
		abbreviation: formatMessage({ id: 'units.m.abbreviation', defaultMessage: 'm' }),
	},
	{
		name: formatMessage({ id: 'units.ft.name', defaultMessage: 'Feet and inches' }),
		abbreviation: formatMessage({ id: 'units.ft.abbreviation', defaultMessage: 'ft' }),
	},
];

interface IFormInput {
	name: string;
	unit: string;
	description?: string;
	code?: string;
	defaultView: string;
	latitude: number;
	longitude: number;
	angleFromNorth: number;
	x: number;
	y: number;
	z: number;
}

const getDefaultValues = (federation: IFederation) => {
	const DEFAULT_UNIT = UNITS[0];
	const { unit = DEFAULT_UNIT.abbreviation, angleFromNorth = 0 } = federation.settings || {};
	const {
		latLong,
		position,
	} = federation.settings?.surveyPoint || {};
	const [x, y, z] = position || [0, 0, 0];
	const [latitude, longitude] = latLong || [0, 0];
	const { code, name, description = '' } = federation;
	const defaultView = federation?.settings?.defaultView || EMPTY_VIEW._id;
	return {
		name,
		description,
		code,
		unit,
		defaultView,
		latitude,
		longitude,
		angleFromNorth,
		x,
		y,
		z,
	};
};

type IFederationSettingsForm = {
	open: boolean;
	federation: IFederation;
	onClose: () => void;
};

export const FederationSettingsForm = ({ open, federation, onClose }: IFederationSettingsForm) => {
	let defaultValues = getDefaultValues(federation) as any;
	const {
		handleSubmit,
		reset,
		watch,
		control,
		formState,
		formState: { errors },
	} = useForm<IFormInput>({
		mode: 'onChange',
		resolver: yupResolver(FederationSettingsSchema),
		defaultValues,
	});

	const currentUnit = watch('unit');

	const { teamspace, project } = useParams() as { teamspace: string, project: string };

	useEffect(() => {
		defaultValues = getDefaultValues(federation) as any;
		reset(defaultValues);
		FederationsActionsDispatchers.fetchFederationSettings(teamspace, project, federation._id);
		FederationsActionsDispatchers.fetchFederationViews(teamspace, project, federation._id);
	}, [open]);

	const onSubmit: SubmitHandler<IFormInput> = ({
		latitude, longitude,
		x, y, z,
		name,
		description,
		code,
		...otherSettings
	}) => {
		const settings: IFederationSettings = {
			surveyPoint: {
				latLong: [latitude, longitude],
				position: [x, y, z],
			},
			...otherSettings,
		};
		const extraSettings: IFederationExtraSettings = { name, desc: description, code };
		FederationsActionsDispatchers.updateFederationSettings(
			teamspace,
			project,
			federation._id,
			settings,
			extraSettings,
		);
		onClose();
	};

	return (
		<FormModal
			title={formatMessage({ id: 'federations.settings.title', defaultMessage: 'Federation settings' })}
			open={open}
			onClickClose={onClose}
			onSubmit={handleSubmit(onSubmit)}
			confirmLabel={formatMessage({ id: 'federations.settings.ok', defaultMessage: 'Save Changes' })}
			isValid={formState.isValid}
		>
			<SectionTitle>Federation information</SectionTitle>
			<ShareTextField
				label="ID"
				value={federation._id}
			/>
			<FormTextField
				name="name"
				control={control}
				label={formatMessage({ id: 'federations.settings.form.name', defaultMessage: 'Name' })}
				required
				formError={errors.name}
			/>
			<FormTextField
				name="description"
				control={control}
				label={formatMessage({ id: 'federations.settings.form.description', defaultMessage: 'Description' })}
				formError={errors.description}
			/>
			<FlexContainer>
				<FormSelect
					required
					name="unit"
					label={formatMessage({
						id: 'federations.settings.form.unit',
						defaultMessage: 'Units',
					})}
					control={control}
					defaultValue={defaultValues.unit}
				>
					{UNITS.map(({ name, abbreviation }) => (
						<MenuItem key={abbreviation} value={abbreviation}>
							{name}
						</MenuItem>
					))}
				</FormSelect>
				<FormTextField
					name="code"
					control={control}
					label={formatMessage({ id: 'federation.settings.form.code', defaultMessage: 'Code' })}
					formError={errors.code}
				/>
			</FlexContainer>
			<FormSelectView
				control={control}
				views={[EMPTY_VIEW].concat(federation.views || [])}
				federationId={federation._id}
				name="defaultView"
				label={formatMessage({
					id: 'federations.settings.form.view',
					defaultMessage: 'Default View',
				})}
			/>
			<SectionTitle>GIS servey point</SectionTitle>
			<FlexContainer>
				<Controller
					name="latitude"
					control={control}
					render={({ field }) => (
						<UnitTextField
							{...field}
							labelname={formatMessage({ id: 'federations.settings.form.lat', defaultMessage: 'LATITUDE' })}
							labelunit={formatMessage({ id: 'federations.settings.form.lat.unit', defaultMessage: 'decimal' })}
							type="number"
							error={!!errors.latitude}
							helperText={errors.latitude?.message}
							required
						/>
					)}
				/>
				<Controller
					name="longitude"
					control={control}
					render={({ field }) => (
						<UnitTextField
							{...field}
							labelname={formatMessage({ id: 'federations.settings.form.long', defaultMessage: 'LONGITUDE' })}
							labelunit={formatMessage({ id: 'federations.settings.form.long.unit', defaultMessage: 'decimal' })}
							type="number"
							error={!!errors.longitude}
							helperText={errors.longitude?.message}
							required
						/>
					)}
				/>
			</FlexContainer>
			<Controller
				name="angleFromNorth"
				control={control}
				render={({ field }) => (
					<UnitTextField
						{...field}
						labelname={formatMessage({ id: 'federations.settings.form.angleFromNorth', defaultMessage: 'ANGLE FROM NORTH' })}
						labelunit={formatMessage({ id: 'federations.settings.form.angleFromNorth.unit', defaultMessage: 'clockwise degrees' })}
						error={!!errors.angleFromNorth}
						helperText={errors.angleFromNorth?.message}
						type="number"
					/>
				)}
			/>
			<FlexContainer>
				<Controller
					name="x"
					control={control}
					render={({ field }) => (
						<UnitTextField
							labelname="X"
							labelunit={currentUnit}
							type="number"
							error={!!errors.x}
							helperText={errors.x?.message}
							required
							{...field}
						/>
					)}
				/>
				<Controller
					name="y"
					control={control}
					render={({ field }) => (
						<UnitTextField
							labelname="Y"
							labelunit={currentUnit}
							type="number"
							error={!!errors.y}
							helperText={errors.y?.message}
							required
							{...field}
						/>
					)}
				/>
				<Controller
					name="z"
					control={control}
					render={({ field }) => (
						<UnitTextField
							labelname="Z"
							labelunit={currentUnit}
							type="number"
							error={!!errors.z}
							helperText={errors.z?.message}
							required
							{...field}
						/>
					)}
				/>
			</FlexContainer>
		</FormModal>
	);
};
