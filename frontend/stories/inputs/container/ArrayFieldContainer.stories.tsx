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
import { Meta, StoryObj } from '@storybook/react';
import { ArrayFieldContainer } from '@controls/inputs/arrayFieldContainer/arrayFieldContainer.component';
import { FormDecorator } from '../inputDecorators';
import { MenuItem, Select, TextField } from '@mui/material';
import faker from 'faker';
import { range } from 'lodash';
import { Gap } from '@controls/gap';
import { useState } from 'react';

const StatefulContainer = ({ disableAdd, disableRemove, Input }) => {
	const [length, setLength] = useState(1);
	return (
		<>
			{range(0, length).map((key, i) => (
				<>
					<ArrayFieldContainer
						disableRemove={disableRemove || length === 1}
						disableAdd={disableAdd || i < (length - 1)}
						key={key}
						onRemove={() => setLength(length - 1)}
						onAdd={() => setLength(length + 1)}
					>
						<Input />
					</ArrayFieldContainer>
					{i < (length - 1) && <Gap $height='8px' />}
				</>
			))}
		</>
	);
};

export default {
	title: 'Inputs/Container/ArrayFieldContainer',
	component: StatefulContainer,
	parameters: { controls: { exclude: [
		'onBlur',
		'onChange',
		'className',
		'inputRef',
		'Input',
	] } },
	decorators: [FormDecorator],
} as Meta<typeof StatefulContainer>;

type Story = StoryObj<typeof StatefulContainer>;

export const FormArrayFieldContainerTextField: Story = {
	args: {
		Input: TextField,
	},
};

const fakeVehicleModels = range(0, 10).map(faker.vehicle.model);
export const FormArrayFieldContainerSelect: Story = {
	args: {
		Input: () => (
			<Select sx={{ width: '100%' }}>
				{fakeVehicleModels.map((model) => (
					<MenuItem key={model} value={model}>
						{model}
					</MenuItem>
				))}
			</Select>
		),
	},
};
