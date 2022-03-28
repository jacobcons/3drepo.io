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

import styled from 'styled-components';
import { Button } from '@controls/button';
import { Link as LinkBase } from 'react-router-dom';
import ErrorIconBase from '@assets/icons/stepper_error.svg';
import CreateAccountIconBase from '@assets/icons/outlined/add_user-outlined.svg';

export const CreateAccountButton = styled(Button).attrs({
	variant: 'contained',
	color: 'primary',
})`
	width: fit-content;
	font-weight: 300;
	margin: 20px 0 0 0;
	width: 100%;
`;

export const TermsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	background-color: ${({ theme }) => theme.palette.base.lightest};
	border-radius: 5px;
	padding: 14px;
	margin-top: 22px;
	box-sizing: border-box;
	
	.grecaptcha-badge {
		display: none;
	}
`;

export const CheckboxContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
`;

export const CheckboxMessage = styled.div`
	flex: 1;
	color: ${({ theme }) => theme.palette.base.main};
	${({ theme }) => theme.typography.caption};
`;

export const Link = styled(LinkBase).attrs({
	target: '_blank',
})`
	text-underline-offset: 1.4px;
	&:active, &:visited, &:hover {
		color: inherit;
	}
`;

export const ErrorContainer = styled.div`
	color: ${({ theme }) => theme.palette.error.main};
	${({ theme }) => theme.typography.body1};
	font-weight: 500;
	margin-top: 13px;
    justify-content: flex-start;
    display: flex;
    align-items: center;
`;

export const ErrorIcon = styled(ErrorIconBase)`
	margin-right: 8px;
	width: 20px;
`;

export const CreateAccountIcon = styled(CreateAccountIconBase)`
	width: 15px;
	width: 15px;
	margin-right: 8px;
`;

export const CircularProgressContainer = styled.div`
	margin: auto;
	margin-top: 20px;
	height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
