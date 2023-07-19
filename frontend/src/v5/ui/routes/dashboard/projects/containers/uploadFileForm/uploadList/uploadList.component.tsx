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

import { UploadItemFields } from '@/v5/store/containers/containers.types';
import { useCallback, useContext } from 'react';
import { useOrderedList } from '@components/dashboard/dashboardList/useOrderedList';
import { DashboardListHeaderLabel } from '@components/dashboard/dashboardList/dashboardListHeaderLabel';
import { FormattedMessage } from 'react-intl';
import { SortingDirection } from '@components/dashboard/dashboardList/dashboardList.types';
import { UploadListItem } from './uploadListItem/uploadListItem.component';
import { ListContainer } from './uploadList.styles';
import { UploadsContext } from '../uploadFileFormContext.component';
import { UploadsListHeader } from '../uploadFileForm.styles';

type IUploadList = {
	values: UploadItemFields[];
	removeUploadById: (id) => void;
	isUploading: boolean;
};
const DEFAULT_SORT_CONFIG = {
	column: 'file',
	direction: SortingDirection.ASCENDING,
};
export const UploadList = ({
	values,
	removeUploadById,
	isUploading,
}: IUploadList): JSX.Element => {
	const { selectedUploadId, setSelectedUploadId, setOriginalIndex } = useContext(UploadsContext);
	const { sortedList, setSortConfig }: any = useOrderedList(values || [], DEFAULT_SORT_CONFIG);

	const memoizedEdit = useCallback((uploadId, origIndex) => {
		setSelectedUploadId(uploadId);
		setOriginalIndex(origIndex);
	}, [values.length]);

	const memoizedDelete = useCallback((uploadId) => {
		setSelectedUploadId('');
		setOriginalIndex(null);
		removeUploadById(uploadId);
	}, [removeUploadById]);
	return (
		<>
			<UploadsListHeader
				onSortingChange={setSortConfig}
				defaultSortConfig={DEFAULT_SORT_CONFIG}
			>
				<DashboardListHeaderLabel key="file" name="file.name" minWidth={122}>
					<FormattedMessage id="uploads.list.header.filename" defaultMessage="Filename" />
				</DashboardListHeaderLabel>
				<DashboardListHeaderLabel key="destination" width={352}>
					<FormattedMessage id="uploads.list.header.destination" defaultMessage="Destination" />
				</DashboardListHeaderLabel>
				<DashboardListHeaderLabel key="revisionName" width={isUploading ? 359 : 399}>
					<FormattedMessage id="uploads.list.header.revisionName" defaultMessage="Revision Name" />
				</DashboardListHeaderLabel>
				<DashboardListHeaderLabel key="progress" width={297} hidden={!isUploading}>
					<FormattedMessage id="uploads.list.header.progress" defaultMessage="Upload Progress" />
				</DashboardListHeaderLabel>
			</UploadsListHeader>
			<ListContainer>
				{
					sortedList.map(({ uploadId, file, extension }) => {
						const origIndex = values.findIndex(({ uploadId: unsortedId }) => unsortedId === uploadId);
						const onClickEdit = () => memoizedEdit(uploadId, origIndex);
						const onClickDelete = () => memoizedDelete(uploadId);
						return (
							<UploadListItem
								key={uploadId}
								fileData={{ ...file, extension }}
								origIndex={origIndex}
								uploadId={uploadId}
								onClickEdit={onClickEdit}
								onClickDelete={onClickDelete}
								isSelected={uploadId === selectedUploadId}
								isUploading={isUploading}
							/>
						);
					})
				}
			</ListContainer>
		</>
	);
};
