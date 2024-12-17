/**
 *  Copyright (C) 2024 3D Repo Ltd
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

import { SearchInput as SearchInputBase } from '@controls/search/searchInput';
import styled, { css } from 'styled-components';

export const SearchInput = styled(SearchInputBase)`
	margin: 0;
	padding: 10px;

	.MuiInputBase-root {
		border: solid 1px ${({ theme }) => theme.palette.base.lightest};

		&, &:hover {
			background-color: transparent;
		}

		input {
			padding-right: 0;
		}

		.MuiInputAdornment-positionEnd {
			margin: 0;
		}
	}
`;

export const DrillDownItem = styled.div<{ $visible: boolean }>`
	transition: max-height .6s;
	height: 100%;
	${({ $visible }) => $visible ? css`
		max-height: 604px;
	` : css`
		max-height: 0;
		overflow-y: hidden;
	`};
	width: 100%;
`;

export const DrillDownItemFiltersList = styled(DrillDownItem)`
	display: grid;
	grid-template-rows: 55px 1fr;
`;

export const DrillDownList = styled.div<{ $visibleIndex: number }>`
	width: 200%;
	height: fit-content;
	overflow-x: hidden;
	display: flex;
	flex-direction: row;
	transition: margin-left .4s;
	margin-left: ${({ $visibleIndex }) => -($visibleIndex * 100)}%;
`;