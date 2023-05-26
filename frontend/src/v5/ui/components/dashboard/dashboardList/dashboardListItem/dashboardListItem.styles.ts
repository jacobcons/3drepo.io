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

import styled, { css } from 'styled-components';
import * as DashboardListItemRowStyles from '@components/dashboard/dashboardList/dashboardListItem/components/dashboardListItemRow/dashboardListItemRow.styles';

const BORDER_RADIUS = '10px';

export const Container = styled.li<{ selected?: boolean }>`
	box-sizing: border-box;
	height: 100%;
	width: 100%;
	list-style: none;
	border-bottom: 1px solid ${({ theme }) => theme.palette.tertiary.lightest};

	&:last-child {
		border-radius: 0 0 ${BORDER_RADIUS} ${BORDER_RADIUS};

		${DashboardListItemRowStyles.Container} {
			${({ selected }) => selected && css`
				&:only-child {
					border-bottom-left-radius: ${BORDER_RADIUS};
					border-bottom-right-radius: ${BORDER_RADIUS};
				}
				& + * {
					border-radius: 0 0 ${BORDER_RADIUS} ${BORDER_RADIUS};
				}
			`}
			
			${({ selected }) => !selected && css`
				border-radius: 0 0 ${BORDER_RADIUS} ${BORDER_RADIUS};
			`}
		}
	}

	&:first-child {
		border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} 0 0;

		${DashboardListItemRowStyles.Container} {
			border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} 0 0;
		}
	}

	&:only-child {
		border-radius: ${BORDER_RADIUS};

		${DashboardListItemRowStyles.Container} {
			${({ selected }) => selected && css`
				& + * {
					border-radius: 0 0 ${BORDER_RADIUS} ${BORDER_RADIUS};
				}
			`}
			${({ selected }) => !selected && css`
				border-radius: ${BORDER_RADIUS};
			`}
		}
	}

	${({ selected }) => selected && css`
		border: none !important;
	`}
`;
