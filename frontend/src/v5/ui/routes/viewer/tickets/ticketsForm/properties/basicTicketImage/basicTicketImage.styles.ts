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

import { Typography } from '@mui/material';
import styled from 'styled-components';
import { CentredContainer } from '@controls/centredContainer';
import { hexToOpacity } from '@/v5/ui/themes/theme';

export const Asterisk = styled.span`
	&::after {
		font-weight: 400;
		font-size: 0.75rem;
		color: ${({ theme }) => theme.palette.error.main};
		margin-left: 2px;
		content: '*';
	}
`;

export const Container = styled.div`
	padding: 13px;
	border: solid 1px ${({ theme }) => theme.palette.secondary.lightest};
	background-color: ${({ theme }) => theme.palette.primary.contrast};
	border-radius: 5px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

export const PropertyName = styled(Typography).attrs({
	variant: 'h5',
})`
	color: ${({ theme }) => theme.palette.secondary.main};
	margin-bottom: 2px;
`;

export const ActionsSide = styled.div`
	display: flex;
	flex-direction: column;
`;

export const ActionsList = styled.ul`
	list-style-type: none;
	padding: 0;
	margin: 0;
`;