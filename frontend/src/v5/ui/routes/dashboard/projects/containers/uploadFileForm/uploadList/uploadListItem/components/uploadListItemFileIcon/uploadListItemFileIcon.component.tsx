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

import { useFormContext } from 'react-hook-form';
import { StyledIconButton } from './uploadListItemFileIcon.styles';

type IUploadListItemFileIcon = {
	revisionPrefix: string;
};

export const UploadListItemFileIcon = ({ revisionPrefix }: IUploadListItemFileIcon): JSX.Element => {
	const { getValues } = useFormContext();
	const extension = getValues(`${revisionPrefix}.extension`);
	return (
		<StyledIconButton extension={extension}>
			{extension[0] || '?'}
		</StyledIconButton>
	);
};
