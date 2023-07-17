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

import { createContext, useState } from 'react';

export interface UploadsContextType {
	selectedUploadId: string;
	setSelectedUploadId: (id: string) => void;
	originalIndex: number
	setOriginalIndex: (index: number) => void;

	props?: any;
}

const defaultValue: UploadsContextType = {
	selectedUploadId: '',
	setSelectedUploadId: () => {},
	originalIndex: null,
	setOriginalIndex: () => {},
};
export const UploadsContext = createContext(defaultValue);
UploadsContext.displayName = 'UploadsContext';

export const UploadsContextComponent = ({ children }) => {
	const [selectedUploadId, setSelectedUploadId] = useState('');
	const [originalIndex, setOriginalIndex] = useState(null);

	return (
		<UploadsContext.Provider value={{ selectedUploadId, setSelectedUploadId, originalIndex, setOriginalIndex }}>
			{children}
		</UploadsContext.Provider>
	);
};
