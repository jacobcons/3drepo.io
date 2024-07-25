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
import { CalibrationContext } from '../../calibrationContext';
import { PlaneType, Vector1D } from '../../calibration.types';
import { TreeActionsDispatchers, ViewerGuiActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { isNull, some } from 'lodash';
import { ModelHooksSelectors } from '@/v5/services/selectorsHooks';
import { UNITS_CONVERSION_FACTORS_TO_METRES, getTransformationMatrix, removeZ } from '../../calibration.helpers';
import { Vector2 } from 'three';

export const VerticalSpatialBoundariesHandler = () => {
	const { verticalPlanes, setVerticalPlanes, vector3D, vector2D, isCalibratingPlanes, setIsCalibratingPlanes, drawingId,
		setSelectedPlane, selectedPlane, isAlignPlaneActive, setIsAlignPlaneActive } = useContext(CalibrationContext);

	// create element of the drawing to be passed to unity
	const i = new Image();
	i.crossOrigin = 'anonymous';
	i.src = getDrawingImageSrc(drawingId);

	const imageHeight = i.naturalHeight;
	const imageWidth = i.naturalWidth;
	
	const modelUnit = ModelHooksSelectors.selectUnit();

	const drawVecStart = new Vector2(...vector2D[0]);
	const drawVecEnd = new Vector2(...vector2D[1]);
	const modelVecStart = new Vector2(...removeZ(vector3D[0]));
	const modelVecEnd = new Vector2(...removeZ(vector3D[1]));
	const diff2D = new Vector2().subVectors(drawVecEnd, drawVecStart);
	const diff3D = new Vector2().subVectors(modelVecEnd, modelVecStart);

	const tMatrix = getTransformationMatrix(diff2D, diff3D);
	
	useEffect(() => {
		if (isCalibratingPlanes && !some(verticalPlanes, isNull)) {
			Viewer.setCalibrationToolMode(isCalibratingPlanes ? 'Vertical' : 'None');
			Viewer.on(VIEWER_EVENTS.UPDATE_CALIBRATION_PLANES, setVerticalPlanes);
			return () => {
				Viewer.setCalibrationToolMode('None');
				Viewer.off(VIEWER_EVENTS.UPDATE_CALIBRATION_PLANES, setVerticalPlanes);
			};
		}
	}, [isCalibratingPlanes, verticalPlanes]);

	useEffect(() => {
		Viewer.setCalibrationToolVerticalPlanes(verticalPlanes[0], verticalPlanes[1]);
	}, [verticalPlanes]);

	useEffect(() => {
		if (isAlignPlaneActive) {
			const onPickPoint = ({ position }) => {
				const initialRange = UNITS_CONVERSION_FACTORS_TO_METRES[modelUnit] * 2.5;
				const zCoord = position[1];
				if (selectedPlane === PlaneType.LOWER) {
					if (verticalPlanes[1] && zCoord > verticalPlanes[1]) return;
					if (isNull(verticalPlanes[1])) {
						setVerticalPlanes([ zCoord, zCoord + initialRange ]);
						setSelectedPlane(PlaneType.UPPER);
						return;
					}
				}
				if (selectedPlane === PlaneType.UPPER) {
					if (verticalPlanes[0] && zCoord < verticalPlanes[0]) return;
					if (isNull(verticalPlanes[0])) {
						setVerticalPlanes([ zCoord - initialRange, zCoord ]);
						setSelectedPlane(PlaneType.LOWER);
						return;
					}
				}
				const newValues = verticalPlanes.map((oldValue, idx) => {
					if (selectedPlane === PlaneType.LOWER && idx === 0) return zCoord;
					if (selectedPlane === PlaneType.UPPER && idx === 1) return zCoord;
					return oldValue;
				}) as Vector1D;
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
		}
	}, [isAlignPlaneActive, selectedPlane, verticalPlanes]);

	useEffect(() => {
		if (imageHeight && imageWidth) {
			const topLeft = drawVecStart.clone().negate(); // This applies the drawing vector offset
			const bottomRight = new Vector2(imageWidth, imageHeight).add(topLeft); // coord origin for drawing is at the top left
			const bottomLeft = new Vector2(topLeft.x, bottomRight.y);
			// transform points with transformation matrix, and then apply the model vector's offset
			[bottomLeft, bottomRight, topLeft].map((corner) => corner.applyMatrix3(tMatrix).add(modelVecStart));

			Viewer.setCalibrationToolDrawing(i, [...bottomLeft, ...bottomRight, ...topLeft]);
			return () => Viewer.setCalibrationToolDrawing(null, [...bottomLeft, ...bottomRight, ...topLeft]);
		}
	}, [imageHeight, imageWidth, tMatrix, drawVecStart]);

	useEffect(() => {
		if (selectedPlane === PlaneType.LOWER && verticalPlanes[0]) {
			Viewer.selectCalibrationToolLowerPlane();
		} else if (selectedPlane === PlaneType.UPPER && verticalPlanes[1]) {
			Viewer.selectCalibrationToolUpperPlane();
		}
	}, [selectedPlane]);

	useEffect(() => {
		setSelectedPlane(PlaneType.LOWER);
		setIsCalibratingPlanes(true);
		setIsAlignPlaneActive(true);
		ViewerGuiActionsDispatchers.setClippingMode(null);
		return () => setIsCalibratingPlanes(false);
	}, []);

	return null;
};
