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

import { FormControl, FormHelperText, InputLabel, InputProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import { ScrollArea } from '@controls/scrollArea';
import { Container, Input } from './formTextAreaFixedSize.styles';

export type FormTextAreaFixedSizeProps = InputProps & {
	control: any,
	formError?: any,
	label?: any,
	height?: number,
};

export const FormTextAreaFixedSize = ({
	defaultValue,
	formError,
	control,
	name,
	required,
	disabled,
	label,
	height = 80,
	...props
}: FormTextAreaFixedSizeProps) => (
	<Controller
		control={control}
		name={name}
		defaultValue={defaultValue}
		render={({ field }) => (
			<FormControl required={required} disabled={disabled} error={!!formError}>
				{label && (
					<InputLabel
						{...field}
						id={`${name}-label`}
					>
						{label}
					</InputLabel>
				)}
				<Container $error={!!formError} $height={height}>
					<ScrollArea autoHeight autoHeightMin={height} autoHeightMax={height} autoHide>
						<Input
							{...field}
							inputRef={field.ref}
							id={name}
							name={name}
							multiline
							minRows={4}
							$height={height}
							{...props}
						/>
					</ScrollArea>
				</Container>
				<FormHelperText>{formError?.message}</FormHelperText>
			</FormControl>
		)}
	/>
);
