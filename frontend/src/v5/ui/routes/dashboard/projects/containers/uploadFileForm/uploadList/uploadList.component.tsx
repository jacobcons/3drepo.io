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
import { UploadItemFields } from '@/v5/store/containers/containers.types';
import { UploadListItem } from './uploadListItem/uploadListItem.component';
import { Container } from './uploadList.styles';

type IUploadList = {
	onClickEdit: (index) => void;
	onClickDelete: (index) => void;
	values: UploadItemFields[];
	selectedIndex: number | null;
	isUploading: boolean;
	getOriginalIndex: (index: number) => number;
};

export const UploadList = ({
	values,
	selectedIndex,
	isUploading,
	onClickEdit,
	onClickDelete,
	getOriginalIndex,
}: IUploadList): JSX.Element => {
	const { getValues } = useFormContext();
	return (
		<Container>
			{
				values.map((item, index) => {
					const originalIndex = getOriginalIndex(index);
					const revisionPrefix = `uploads.${originalIndex}`;
					const defaultInputValues = {
						containerName: getValues(`${revisionPrefix}.containerName`) || item.containerName,
						revisionTag: getValues(`${revisionPrefix}.revisionTag`) || item.revisionTag,
					};
					return (
						<UploadListItem
							revisionPrefix={revisionPrefix}
							key={item.uploadId}
							item={item}
							defaultValues={defaultInputValues}
							onClickEdit={() => onClickEdit(originalIndex)}
							onClickDelete={() => onClickDelete(index)}
							isSelected={index === selectedIndex}
							isUploading={isUploading}
						/>
					);
				})
			}
		</Container>
	);
};
