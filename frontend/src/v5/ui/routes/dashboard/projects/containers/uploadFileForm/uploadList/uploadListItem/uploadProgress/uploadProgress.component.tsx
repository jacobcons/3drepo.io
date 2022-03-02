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

import React from 'react';
import TickIcon from '@assets/icons/tick';
import { UploadStatuses } from '@/v5/store/containers/containers.types';
import { ErrorTooltip } from '@controls/errorTooltip';
import { CompletionMark, Container, Progress, StatusText } from './UploadProgress.styles';

type IUploadProgress = {
	progress: number;
	errorMessage: string;
	hidden: boolean;
};

export const UploadProgress = ({ progress, errorMessage, hidden }: IUploadProgress): JSX.Element => {
	let statusText: string;
	let uploadStatus;
	if (errorMessage) {
		statusText = 'Upload failed';
		uploadStatus = UploadStatuses.FAILED;
	} else if (progress === 100) {
		statusText = 'Upload complete';
		uploadStatus = UploadStatuses.UPLOADED;
	} else if (progress < 100 && progress > 0) {
		statusText = 'Uploading';
		uploadStatus = UploadStatuses.UPLOADING;
	} else if (progress === 0) {
		statusText = 'Waiting to upload';
		uploadStatus = UploadStatuses.QUEUED;
	} else statusText = 'Unexpected Error';

	return hidden ? (<></>) : (
		<Container>
			<StatusText uploadstatus={uploadStatus}>
				{statusText}
				{errorMessage && (
					<ErrorTooltip>
						{errorMessage}
					</ErrorTooltip>
				)}
			</StatusText>
			<Progress uploadStatus={uploadStatus} progress={progress} />
			<CompletionMark> {uploadStatus === 'uploaded' && <TickIcon />} </CompletionMark>
		</Container>
	);
};
