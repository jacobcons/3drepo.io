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
import { FormDialogContent } from '@controls/modal/formModal/formDialog.styles';
import { FormModal as FormModalBase } from '@controls/modal/formModal/formDialog.component';
import { HeaderButtonsGroup } from '@/v5/ui/routes/dashboard/projects/containers/containers.styles';

export const FormModal = styled(FormModalBase)`
	${FormDialogContent} {
		margin: 0;
		padding-bottom: 0;
	}

	${HeaderButtonsGroup} {
		display: flex;
		justify-content: flex-end;
		margin-right: 15px;
	}
`;

export const Container = styled.div`
	margin: 16px 0;
`;

export const CollapseSideElementGroup = styled.div`
	display: flex;
	align-items: center;
`;
