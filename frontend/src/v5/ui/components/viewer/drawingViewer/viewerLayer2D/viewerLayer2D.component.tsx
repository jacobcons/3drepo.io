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

import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Container, LayerLevel } from './viewerLayer2D.styles';
import { PanZoomHandler } from '../panzoom/centredPanZoom';
import { isEqual } from 'lodash';
import { SnapCursor } from './snapCursor/snapCursor.component';
import { Coord2D } from '@/v5/ui/routes/dashboard/projects/calibration/calibration.types';
import { CalibrationContext } from '@/v5/ui/routes/dashboard/projects/calibration/calibrationContext';
import { SVGSnapHelper } from '../snapping/svgSnapHelper';
import { Vector2 } from 'three';
import { SnapType } from '../snapping/types';
import { DrawingViewerService } from '../drawingViewer.service';
import { CalibrationArrow } from './calibrationArrow/calibrationArrow.component';
import { useSnapping } from '../drawingViewer.service.hooks';

export type ViewBoxType = ReturnType<PanZoomHandler['getOriginalSize']> & ReturnType<PanZoomHandler['getTransform']>;
type ViewerLayer2DProps = {
	viewBox: ViewBoxType,
	snapHandler: SVGSnapHelper,
	snapping?: boolean,
};

const snap = (mousePos:Coord2D, snapHandler: SVGSnapHelper, radius) => {
	const results = snapHandler?.snap(new Vector2(...mousePos), radius) || { closestNode: undefined, closestIntersection: undefined, closestEdge: undefined };
	let snapType = SnapType.NONE;

	if (results.closestNode != null) {
		snapType = SnapType.NODE;
		mousePos = [results.closestNode.x, results.closestNode.y];
	} else if (results.closestIntersection != null) {
		snapType = SnapType.INTERSECTION;
		mousePos = [results.closestIntersection.x, results.closestIntersection.y];
	} else if (results.closestEdge != null) {
		snapType = SnapType.EDGE;
		mousePos = [results.closestEdge.x, results.closestEdge.y];
	} 
	return {
		mousePos,
		snapType,
	};
};

export const ViewerLayer2D = ({ viewBox, snapHandler }: ViewerLayer2DProps) => {
	const { isCalibrating } = useContext(CalibrationContext);
	const previousViewBox = useRef<ViewBoxType>(null);
	const [snapType, setSnapType] = useState<SnapType>(SnapType.NONE);
	const snapping = useSnapping();

	const containerStyle: CSSProperties = {
		transformOrigin: '0 0',
		transform: `matrix(${viewBox.scale}, 0, 0, ${viewBox.scale}, ${viewBox.x}, ${viewBox.y})`,
		width: `${viewBox.width}px`,
		height: `${viewBox.height}px`,
	};

	const handleMouseDown = () => previousViewBox.current = viewBox;

	const getCursorOffset = (e) => {
		const rect = e.target.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;
		return [offsetX, offsetY].map((point) => point / viewBox.scale) as Coord2D;
	};

	const handleMouseUp = useCallback((e) => {
		let mousePosition = getCursorOffset(e);

		// check if mouse up was fired after dragging or if it was an actual click
		if (!isEqual(viewBox, previousViewBox.current)) return;

		if (snapping) {
			const radius = 10 / viewBox.scale;
			const res = snap(mousePosition, snapHandler, radius);
			mousePosition = res.mousePos;

			if (snapType !== res.snapType) {
				setSnapType(res.snapType);
			}
		}

		DrawingViewerService.emitMouseClickEvent(mousePosition);
	}, [viewBox]);

	const handleMouseMove = useCallback((e) => {
		let mousePos = getCursorOffset(e);

		if (snapping) {
			const radius = 10 / viewBox.scale;
			const res = snap(mousePos, snapHandler, radius);
			mousePos = res.mousePos;

			if (snapType !== res.snapType) {
				setSnapType(res.snapType);
			}
		}

		DrawingViewerService.setMousePosition(mousePos);
	}, [snapHandler, snapType, snapping, viewBox]);

	const handleMouseLeave = () => DrawingViewerService.setMousePosition(undefined);

	useEffect(() => { DrawingViewerService.setScale(viewBox.scale); }, [viewBox]);

	return (
		<Container style={containerStyle} id="viewerLayer2d" >
			<LayerLevel>
				{snapping && <SnapCursor snapType={snapType} />}
				{isCalibrating && <CalibrationArrow />}
			</LayerLevel>
			<LayerLevel
				onMouseUp={handleMouseUp}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			/>
		</Container>
	);
};