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

import styled, { css } from 'styled-components';
import { LinkCard } from '../../linkCard.component';
import { CardImage } from '../../linkCard.styles';

const PlaceholderStyle = css`
	background-color: ${({ theme }) => theme.palette.secondary.light};
	opacity: 0.1;
	border-radius: 3px;
`;

export const TextPlaceholder = styled.div<{ width?: string;}>`
	${PlaceholderStyle}
	height: 10px;
	width: ${({ width }) => width || '100%'};
	margin-top: 9px;
`;

export const Card = styled(LinkCard)`
	pointer-events: none;
	${CardImage} {
		${PlaceholderStyle}
	}
`;

export const DisableHoverState = styled.div`
	pointer-events: none;
`;
