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

import { forwardRef } from 'react';
import { getFileFromInputEvent, getSupportedImageExtensions } from '../image.helper';
import { HiddenFileUploader, HiddenFileUploaderProps } from '../hiddenFileUploader/hiddenFileUploader.component';

export const HiddenImageUploader = forwardRef(({ onChange, ...props }: HiddenFileUploaderProps, ref: any) => {
	const accept = getSupportedImageExtensions();

	const uploadImage = (event) => {
		const imgFile = getFileFromInputEvent(event);
		onChange(imgFile);
	};

	return (<HiddenFileUploader onChange={uploadImage} accept={accept} {...props} ref={ref} />);
});
