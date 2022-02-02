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

import { Tooltip } from '@material-ui/core';
import ErrorIcon from '@assets/icons/error_circle.svg';
import { Input } from './uploadListItemDestination.styles';

type IUploadListItemDestination = {
	errorMessage?: string;
};

export const UploadListItemDestination = ({ errorMessage, ...props }: IUploadListItemDestination): JSX.Element => (
	<Input
		error={!!errorMessage}
		InputProps={{
			startAdornment: !!errorMessage && (
				<Tooltip title={errorMessage} placement="bottom-start">
					<span>
						<ErrorIcon />
					</span>
				</Tooltip>
			),
		}}
		{...props}
	/>
);
