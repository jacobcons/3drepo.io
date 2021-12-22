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

import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import ChevronIcon from '@assets/icons/chevron.svg'

export const Select = styled(TextField).attrs({
	select: true,
	SelectProps: {
		IconComponent: ChevronIcon,
      }
})`
	width: 50%;
	box-sizing: border-box;
	padding-right: 5px;

	& + & {
		padding: 0 0 0 5px;
		label { padding: 0 0 0 5px }
	}

	svg path {
		fill: ${({ theme }) => theme.palette.base.main};
	}
`;
