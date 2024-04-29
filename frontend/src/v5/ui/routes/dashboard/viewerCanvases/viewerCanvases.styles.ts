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

import { PropsWithChildren } from 'react';
import BaseSplitPane, { SplitPaneProps } from 'react-split-pane';
import ResizePaneIcon from '@assets/icons/outlined/horizontal_resize-outlined.svg';
import styled, { css } from 'styled-components';
import { ComponentToString } from '@/v5/helpers/react.helper';

export const SplitPane = styled(BaseSplitPane)<PropsWithChildren<SplitPaneProps & { is2DOpen: boolean; }>>`
	.Resizer {
		box-sizing: border-box;
		background-clip: padding-box;
		z-index: 1;
		&.vertical {
			background-color: ${({ theme }) => theme.palette.base.light};
			width: 24px;
			margin: 0 -12px;
			cursor: col-resize;
			border-left: 12px solid transparent;
			border-right: 11px solid transparent;
			flex-shrink: 0;

			&:hover {
				background-color: ${({ theme }) => theme.palette.tertiary.light};
			}
			&:active {
				background-color: ${({ theme }) => theme.palette.tertiary.mid};
			}

			::after {
				content: url('data:image/svg+xml;utf8,${ComponentToString(ResizePaneIcon)}');
				padding-top: 3px;
				height: 40px;
				width: 24px;
				border-radius: 4px;
				background-color: inherit;
				box-sizing: border-box;
				position: absolute;
				bottom: 140px;
				align-content: center;
				text-align: center;
				transform: translateX(-50%);
			}
		}
	}
	${({ is2DOpen }) => !is2DOpen && css`
		>.Resizer,>.Pane2 {
			display: none;
		}
		>.Pane1 {
			width: 100% !important;
		}
	`}
`;
