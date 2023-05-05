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

import { Typography } from '@controls/typography';
import styled, { css } from 'styled-components';

export const PinContainer = styled.div<{ selected: boolean, error: boolean, disabled: boolean }>`
	width: auto;
	border: solid 1px;
	${({ disabled, theme: { palette } }) => (disabled ? css`
		border-color: ${palette.secondary.lightest};
		color: ${palette.base.light};
	` : css`
		border-color: ${palette.base.lightest};
		color: ${palette.secondary.main};
	`)}
	border-radius: 8px;
	padding: 10px 15px;

	${({ selected, theme: { palette } }) => selected && css`
		box-shadow: 0 0 4px ${palette.primary.main};
		border-color: ${palette.primary.main};
	`}

	${({ error, theme: { palette } }) => error && css`
		color: ${palette.error.main};
		background-color: ${palette.error.lightest};
		border-color: ${palette.error.main};
		box-shadow: 0 0 4px ${palette.error.main};
	`}

`;

export const PinActions = styled.div`
	display: flex;
	gap: 14px;
`;

export const PinName = styled(Typography).attrs({
	variant: 'h5',
})<{required:boolean}>`
	user-select: none;

	${({ required }) => required && css`
		&::after {
			font-weight: 400;
			font-size: 0.75rem;
			color: ${({ theme }) => theme.palette.error.main};
			margin-left: 2px;
			content: '*';
		}
	`}
`;

export const PinAction = styled.div<{disabled?: boolean}>`
	font-size: 10px;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 3px;
	user-select: none;
	${({ theme: { palette }, disabled }) => (disabled ? css`
		color: ${palette.secondary.lightest};
		pointer-events: none;
	` : css`
		color: ${palette.base.main};
		cursor: pointer;
	`)};
	svg {
		height: 12px;
		width: auto;
	}
`;

export const SettingLocationText = styled(PinAction)`
	font-style: italic;
	color: inherit;
	svg {
		height: 10px;
		margin: 0 5px;
	}
`;
