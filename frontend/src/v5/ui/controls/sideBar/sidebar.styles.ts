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
import { CircleButton } from '@controls/circleButton';

export const Container = styled.span`
	width: 0;
	background-color: ${({ theme }) => theme.palette.primary.contrast};
	transition: width 0.1s;
	position: relative;
	:not(.isOpen) {
		svg {
			transform: scaleX(-1);
		}
	}

	&.isOpen {
		width: 400px;
		transition: width 0.1s;
		padding: 29px;
		box-sizing: border-box;
		flex-shrink: 0;
	}
`;

export const Content = styled.div`
	overflow: hidden;
`;

export const Button = styled(CircleButton)`
	position: absolute;
	right: 10px;
	top: 5px;
`;
