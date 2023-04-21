/**
 *  Copyright (C) 2023 3D Repo Ltd
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
import { CommentButtons } from '../../ticketsForm/commentsPanel/comment/basicComment/basicComment.styles';
import { Accordion } from '@controls/accordion/accordion.component';

const GroupStyling = css`
	border: 0;
	border-radius: 8px;
	height: 42px;
	box-sizing: border-box;
	background-color: ${({ theme }) => theme.palette.primary.contrast};
	padding: 7px;
	display: flex;
	align-items: center;
`;

export const GroupItem = styled.div`
	${GroupStyling}
	flex-direction: row;
	margin-bottom: 4px;
`;

export const GroupCollection = styled(Accordion)`
	&& {
		border: 0;
		background-color: transparent;
		margin-top: 9px;

		&::after {
			opacity: 1;
		}

		&:last-of-type::after {
			border-bottom-left-radius: 5px;
		}

		.MuiAccordionSummary-root {
			${GroupStyling}
			flex-direction: row-reverse;
			padding-left: 14px;
		}

		.MuiAccordionSummary-expandIconWrapper {
			background-color: ${({ theme }) => theme.palette.secondary.main};
			color: ${({ theme }) => theme.palette.primary.contrast};
			border-radius: 50%;
			width: 16px;
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 1px;
			box-sizing: border-box;

			svg {
				width: 8px;
				height: 6px;
			}

			&:not(.Mui-expanded) {
				transform: rotate(270deg);
			}
		}

		.MuiAccordionDetails-root {
			padding: 9px 0 0 16px;
			overflow: hidden;
		}
	}
`;

export const CollectionTitle = styled.span`
	display: flex;
	flex-direction: row;
	align-items: center;

	&:hover ${CommentButtons} {
		opacity: 1;
	}
`;

export const GroupOfGroupsContainer = styled.div`
	margin: 0;
	padding-left: 0;
	position: relative;
`;

export const Icon = styled.div`
	border-radius: 5px;
`;

export const NameContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 10px;
`;

export const Name = styled(Typography).attrs({
	variant: 'body1',
})`
	cursor: pointer;
    width: max-content;
	color: ${({ theme }) => theme.palette.secondary.main};
`;

export const GroupsCount = styled(Typography).attrs({
	variant: 'caption',
})`
	color: ${({ theme }) => theme.palette.base.main};
`;

export const GroupsAccordionContainer = styled(Accordion)<{ groupsCount?: number }>`
	background: transparent;

	&& {
		border-radius: 0;
		border: 0;
	}

	.MuiAccordionSummary-root {
		border-bottom: 1px solid ${({ theme }) => theme.palette.secondary.lightest};
		background-color: ${({ theme }) => theme.palette.primary.contrast};
	}

	.MuiAccordionDetails-root {
		border-top: 0;
		padding: 14px;
		display: flex;
		flex-direction: column;
	}

	&.Mui-expanded + & .MuiAccordionSummary-root {
		border-top: 1px solid ${({ theme }) => theme.palette.secondary.lightest};
	}

	${GroupCollection} :is(${GroupCollection}, ${GroupItem}) {
		position: relative;

		&::after {
			content: "";
			background: transparent;
			box-sizing: border-box;
			border-bottom: solid 1px ${({ theme }) => theme.palette.base.lightest};
			border-left: solid 1px ${({ theme }) => theme.palette.base.lightest};
			width: 9px;
			left: -9px;
			position: absolute;
			${({ groupsCount = 0 }) => css`
				border-right: ${(groupsCount + 1)}px;
				height: ${(groupsCount + 1) * 61}px;
				top: -${(groupsCount + 1) * 61 - 22}px;
			`}
		}

		&:last-child::after {
			border-left: solid 1px ${({ theme }) => theme.palette.base.lightest};
			border-bottom-left-radius: 5px;
		}
	}
`;
