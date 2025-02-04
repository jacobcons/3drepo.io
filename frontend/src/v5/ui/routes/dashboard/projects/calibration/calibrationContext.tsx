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

import { createContext, useState } from 'react';
import { Transformers, useSearchParam } from '../../../useSearchParam';
import { PlaneType, Vector1D, Vector2D, Vector3D } from '@/v5/ui/routes/dashboard/projects/calibration/calibration.types';
import { EMPTY_VECTOR } from '@/v5/ui/routes/dashboard/projects/calibration/calibration.constants';
import { DrawingsHooksSelectors } from '@/v5/services/selectorsHooks';

export interface CalibrationContextType {
	step: number;
	setStep: (step: number) => void;
	isCalibrating: boolean;
	origin: string;
	setOrigin: (origin: string) => void;
	isCalibrating3D: boolean,
	setIsCalibrating3D: (isCalibrating3D: boolean) => void;
	isCalibrating2D: boolean,
	setIsCalibrating2D: (isCalibrating2D: boolean) => void;
	vector3D: Vector3D,
	setVector3D: (vectorState: React.SetStateAction<Vector3D>) => void;
	vector2D: Vector2D,
	setVector2D: (vectorState: React.SetStateAction<Vector2D>) => void,
	drawingId: string;
	verticalPlanes: Vector1D,
	setVerticalPlanes: (planes: Vector1D) => void,
	isCalibratingPlanes: boolean,
	setIsCalibratingPlanes: (isCalibratingPlanes: boolean) => void,
	selectedPlane: PlaneType,
	setSelectedPlane: (plane: PlaneType) => void,
	isAlignPlaneActive: boolean,
	setIsAlignPlaneActive: (isActive: boolean) => void,
}

const defaultValue: CalibrationContextType = {
	step: 0,
	setStep: () => {},
	isCalibrating: false,
	origin: '',
	setOrigin: () => {},
	isCalibrating3D: false,
	setIsCalibrating3D: () => {},
	isCalibrating2D: false,
	setIsCalibrating2D: () => {},
	vector3D: EMPTY_VECTOR,
	setVector3D: () => {},
	vector2D: EMPTY_VECTOR,
	setVector2D: () => {},
	drawingId: '',
	verticalPlanes: EMPTY_VECTOR,
	setVerticalPlanes: () => {},
	isCalibratingPlanes: false,
	setIsCalibratingPlanes: () => {},
	selectedPlane: null,
	setSelectedPlane: () => {},
	isAlignPlaneActive: false,
	setIsAlignPlaneActive: () => {},
};
export const CalibrationContext = createContext(defaultValue);
CalibrationContext.displayName = 'CalibrationContext';

export const CalibrationContextComponent = ({ children }) => {
	const [step, setStep] = useState(0);
	const [origin, setOrigin] = useState('');
	const [isCalibrating] = useSearchParam('isCalibrating', Transformers.BOOLEAN);
	const [isCalibrating3D, setIsCalibrating3D] = useState(false);
	const [isCalibratingPlanes, setIsCalibratingPlanes] = useState(false);
	const [isCalibrating2D, setIsCalibrating2D] = useState(false);
	const [vector3D, setVector3D] = useState<Vector3D>(EMPTY_VECTOR);
	const [vector2D, setVector2D] = useState<Vector2D>(EMPTY_VECTOR);
	const [verticalPlanes, setVerticalPlanes] = useState<Vector1D>(EMPTY_VECTOR);
	const [selectedPlane, setSelectedPlane] = useState<PlaneType>(null);
	const [isAlignPlaneActive, setIsAlignPlaneActive] = useState(false);
	const [drawingId] = useSearchParam('drawingId');
	const hasCollaboratorAccess = DrawingsHooksSelectors.selectHasCollaboratorAccess(drawingId);

	return (
		<CalibrationContext.Provider value={{
			step,
			setStep,
			isCalibrating: isCalibrating && hasCollaboratorAccess,
			origin,
			setOrigin,
			isCalibrating3D,
			setIsCalibrating3D,
			isCalibrating2D,
			setIsCalibrating2D,
			vector2D,
			setVector2D,
			vector3D,
			setVector3D,
			drawingId,
			verticalPlanes,
			setVerticalPlanes,
			isCalibratingPlanes,
			setIsCalibratingPlanes,
			selectedPlane,
			setSelectedPlane,
			isAlignPlaneActive,
			setIsAlignPlaneActive,
		}}>
			{children}
		</CalibrationContext.Provider>
	);
};