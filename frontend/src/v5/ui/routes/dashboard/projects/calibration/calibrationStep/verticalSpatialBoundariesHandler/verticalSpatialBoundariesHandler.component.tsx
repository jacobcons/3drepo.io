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

import { useContext, useEffect } from 'react';
import { Viewer } from '@/v4/services/viewer/viewer';
import { VIEWER_EVENTS } from '@/v4/constants/viewer';
import { getDrawingImageSrc } from '@/v5/store/drawings/drawings.helpers';
import { addVectors, flipYAxis, getTransformationMatrix, getXYPlane, subtractVectors, transformAndTranslate } from '../../calibrationHelpers';
import { CalibrationContext } from '../../calibrationContext';
import { PlaneType } from '../../calibration.types';
import { TreeActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { isNull } from 'lodash';

export const VerticalSpatialBoundariesHandler = () => {
	const { verticalPlanes, setVerticalPlanes, vector3D, vector2D, isCalibratingPlanes, setIsCalibratingPlanes, drawingId,
		setSelectedPlane, selectedPlane } = useContext(CalibrationContext);

	// create pseudo-element of the drawing to be passed to unity
	const i = new Image();
	i.crossOrigin = 'anonymous';
	i.src = getDrawingImageSrc(drawingId);

	const imageHeight = i.naturalHeight;
	const imageWidth = i.naturalWidth;

	const modelVector = getXYPlane(vector3D).map(flipYAxis); // TODO why is y flipped? 
	const drawingVector = vector2D.map(flipYAxis);
	const tMatrix = getTransformationMatrix(drawingVector, modelVector);
	
	useEffect(() => {
		if (isCalibratingPlanes) {
			Viewer.setCalibrationToolMode(isCalibratingPlanes ? 'Vertical' : 'None');
			Viewer.on(VIEWER_EVENTS.UPDATE_CALIBRATION_PLANES, setVerticalPlanes);
		}
		return () => {
			Viewer.setCalibrationToolMode('None');
			Viewer.off(VIEWER_EVENTS.UPDATE_CALIBRATION_PLANES, setVerticalPlanes);
		};
	}, [isCalibratingPlanes]);

	useEffect(() => {
		const onPickPoint = ({ position }) => {
			const zIndex = position[1];
			if (selectedPlane === PlaneType.LOWER) {
				if (zIndex > verticalPlanes[PlaneType.UPPER]) return;
				if (isNull(verticalPlanes[PlaneType.LOWER])) setSelectedPlane(PlaneType.UPPER);
			}
			if (selectedPlane === PlaneType.UPPER) {
				if (zIndex < verticalPlanes[PlaneType.LOWER]) return;
				if (isNull(verticalPlanes[PlaneType.UPPER])) setSelectedPlane(null);
			}
			const newValues = { ...verticalPlanes, [selectedPlane]: zIndex };
			Viewer.setCalibrationToolVerticalPlanes(newValues);
			setVerticalPlanes(newValues);
		};
		TreeActionsDispatchers.stopListenOnSelections();
		Viewer.enableEdgeSnapping();
		Viewer.on(VIEWER_EVENTS.PICK_POINT, onPickPoint);
		return () => {
			TreeActionsDispatchers.startListenOnSelections();
			Viewer.disableEdgeSnapping();
			Viewer.off(VIEWER_EVENTS.PICK_POINT, onPickPoint);
		};
	}, [isCalibratingPlanes, selectedPlane, verticalPlanes]);

	useEffect(() => {
		if (!imageHeight || !imageWidth) return;
	
		const [xmin, ymin] = subtractVectors(drawingVector[0], [0, -imageHeight]); // !working
		const [xmax, ymax] = addVectors([xmin, ymin], [imageWidth, imageHeight]);

		// transform corners of drawing. Adding offset of model vector
		const bottomRight = transformAndTranslate([xmax, -ymin], tMatrix, modelVector[0]); // TODO why minuses?
		const topLeft = transformAndTranslate([xmin, -ymax], tMatrix, modelVector[0]);
		const bottomLeft = transformAndTranslate([xmin, -ymin], tMatrix, modelVector[0]);

		const imageDimensions = [ ...bottomLeft, ...bottomRight, ...topLeft];
		Viewer.setCalibrationToolDrawing(i, imageDimensions);
		return () => Viewer.setCalibrationToolDrawing(null, imageDimensions);
	}, [imageHeight, imageWidth]);

	useEffect(() => {
		if (selectedPlane === PlaneType.LOWER && verticalPlanes[PlaneType.LOWER]) {
			Viewer.selectCalibrationToolLowerPlane();
		} else if (selectedPlane === PlaneType.UPPER && verticalPlanes[PlaneType.UPPER]) {
			Viewer.selectCalibrationToolUpperPlane();
		}
	}, [selectedPlane]);

	useEffect(() => {
		setSelectedPlane(PlaneType.LOWER);
		setIsCalibratingPlanes(true);
		return () => setIsCalibratingPlanes(false);
	}, []);

	return null;
};
