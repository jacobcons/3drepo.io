/**
 *  Copyright (C) 2020 3D Repo Ltd
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

import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import { COLOR } from '../../styles';

const BaseStyles = styled(Grid)`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const ItemLabel = styled(BaseStyles)`
	font-size: 14px;
	color: ${COLOR.BLACK_60};
`;

export const ItemLabelDetail = styled(BaseStyles)`
	font-size: 10px;
	color: ${COLOR.BLACK_40};
	line-height: 13px;
`;

export const BarIconButton = styled(IconButton)`
	&& {
		color: rgba(255, 255, 255, 0.87);
	}

	&:first-child {
		margin-right: -18px;
	}
`;

export const EmptyStateInfo = styled.p`
	padding: 14px;
	font-size: 13px;
	color: ${COLOR.BLACK_60};
	background-color: ${COLOR.BLACK_6};
	margin: 25px;
	border-radius: 6px;
	text-align: center;
`;
