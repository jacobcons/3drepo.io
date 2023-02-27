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

import { Button } from '@controls/button';
import { Link as BaseLink } from 'react-router-dom';
import styled from 'styled-components';
import { FONT_WEIGHT } from '@/v5/ui/themes/theme';
import { Typography } from '@mui/material';

export const Container = styled.div`
	margin: auto;
	box-sizing: border-box;
	display: block;
	width: 412px;
	color: ${({ theme }) => theme.palette.secondary.main};
	margin-left: 40px;
`;

export const MainTitle = styled.div`
	${({ theme }) => theme.typography.h1};
	font-size: 40px;
	font-weight: ${FONT_WEIGHT.BOLDER};
	line-height: 42px;
	margin-bottom: 27px;
	width: 270px;
`;

export const SSOButton = styled(Button).attrs({
	component: BaseLink,
	variant: 'contained',
	color: 'primary',
})`
	width: fit-content;
	font-weight: 500;
	font-size: 12px;
	border-radius: 0;
	background-color: #2F2F2F;

	&:hover {
		background-color: #2F2F2FF0;
	}

	&:active{
		background-color: #2F2F2FF0;
	}

	margin: 0 0 43px;
	padding:20px;
`;

export const SignUpWithMicrosoftText = styled(Typography)`
	${({ theme }) => theme.typography.h1};
	margin-bottom: 10px;
`;

export const MicrosoftInstructionsText = styled(Typography)`
	${({ theme }) => theme.typography.body1};
	color: ${({ theme }) => theme.palette.base.main};
	margin-bottom: 5px;
	width: 376px;
`;

export const MicrosoftInstructionsRemarkText = styled(Typography)`
	${({ theme }) => theme.typography.body1};
	color: ${({ theme }) => theme.palette.secondary.main};
	font-weight: ${FONT_WEIGHT.BOLDER};
	font-size: 10px;
`;

export const MicrosoftInstructionsTermsText = styled(Typography)`
	${({ theme }) => theme.typography.inter};
	color: ${({ theme }) => theme.palette.base.main};
	width: 360px;
	font-size: 10px;
	margin-bottom: 20px;
`;

export const Link = styled(BaseLink)`
	&& {
		color: ${({ theme }) => theme.palette.primary.main};
		text-decoration: none;
		font-weight: ${FONT_WEIGHT.BOLDER};
	}
`;

export const SidebarContent = styled.div`
	margin-left: 4px;
`;

export const NewSticker = styled.div`
	${({ theme }) => theme.typography.inter};
	color: ${({ theme }) => theme.palette.primary.main};
	border: solid 1.5px ${({ theme }) => theme.palette.primary.main}; 
	border-radius: 5px;
	padding: 4px 6px;
	display: inline;
	font-size: 10px;
	font-weight: 700;
	top: -4px;
	position: relative;
	left: 8px;
`;
