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

import { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { Container, LayerLevel, Viewport } from './viewerLayer2D.styles';
import { isEqual } from 'lodash';
import { SvgArrow } from './svgArrow/svgArrow.component';
import { SvgCircle } from './svgCircle/svgCircle.component';
import { Coord2D, Vector2D, ViewBoxType } from '@/v5/ui/routes/dashboard/projects/calibration/calibration.types';
import { PinsLayer } from '../pinsLayer/pinsLayer.component';
import { PinsDropperLayer } from '../pinsDropperLayer/pinsDropperLayer.component';
import { CalibrationContext } from '@/v5/ui/routes/dashboard/projects/calibration/calibrationContext';
import { TicketsCardHooksSelectors } from '@/v5/services/selectorsHooks';
import { Camera } from './camera/camera.component';
import { CameraOffSight } from './camera/cameraOffSight.component';
import { EMPTY_VECTOR } from '@/v5/ui/routes/dashboard/projects/calibration/calibration.constants';

type ViewerLayer2DProps = {
	viewBox: ViewBoxType,
	active: boolean,
	value?: Vector2D,
	viewport: any,
	onChange?: (arrow: Vector2D) => void;
	cameraEnabled: boolean;
};
export const ViewerLayer2D = ({ viewBox, active, value, cameraEnabled, viewport, onChange }: ViewerLayer2DProps) => {
	const { isCalibrating } = useContext(CalibrationContext);
	const [offsetStart, setOffsetStart] = useState<Coord2D>(value[0]);
	const [offsetEnd, setOffsetEnd] = useState<Coord2D>(value[1]);
	const previousViewBox = useRef<ViewBoxType>(null);
	const [mousePosition, setMousePosition] = useState<Coord2D>(null);
	const isDroppingPin = !!TicketsCardHooksSelectors.selectPinToDrop();
	const [cameraOnSight, setCameraOnSight] = useState(false);

	const containerStyle: CSSProperties = {
		transformOrigin: '0 0',
		transform: `matrix(${viewBox.scale}, 0, 0, ${viewBox.scale}, ${viewBox.x}, ${viewBox.y})`,
		width: `${viewBox.width}px`,
		height: `${viewBox.height}px`,
	};

	// This returns the offset of the cursor from the top-left corner
	const getCursorOffset = (e) => {
		const rect = e.target.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;
		return [offsetX, offsetY].map((point) => point / viewBox.scale) as Coord2D;
	};

	const handleMouseDown = () => previousViewBox.current = viewBox;

	const handleMouseUp = () => {
		// check if mouse up was fired after dragging or if it was an actual click
		if (!isEqual(viewBox, previousViewBox.current)) return;

		if (offsetEnd || (!offsetEnd && !offsetStart)) {
			setOffsetEnd(null);
			setOffsetStart(mousePosition);
			onChange(EMPTY_VECTOR);
		} else if (!isEqual(offsetStart, mousePosition)) {
			setOffsetEnd(mousePosition);
			onChange?.([offsetStart, mousePosition]);
		}
	};

	const handleMouseMove = (e) => {
		setMousePosition(getCursorOffset(e));
	};

	const resetArrow = () => {
		setOffsetStart(null);
		setOffsetEnd(null);
	};

	useEffect(() => {
		if (!active && !offsetEnd) {
			resetArrow();
		}
	}, [active]);

	useEffect(() => {
		// avoid resetting the values when 2d vector exists and the user sets a new start 
		if (value[1] === null) return; 
		setOffsetStart(value[0]);
		setOffsetEnd(value[1]);
	}, [value]);

	return (
		<Viewport>
			{cameraEnabled && <CameraOffSight onCameraSightChanged={setCameraOnSight} scale={viewBox.scale} viewport={viewport}/>}
			<Container style={containerStyle} id="viewerLayer2d">
				<LayerLevel>
					{isCalibrating ? (
						<>
							{mousePosition && active && <SvgCircle coord={mousePosition} scale={viewBox.scale} />}
							{offsetStart && <SvgArrow start={offsetStart} end={offsetEnd ?? mousePosition} scale={viewBox.scale} />}
						</>
					) : (
						<>
							{(cameraOnSight && cameraEnabled) && <Camera scale={viewBox.scale} />}
							{isDroppingPin && <PinsDropperLayer getCursorOffset={getCursorOffset} viewBox={viewBox} />}
							<PinsLayer scale={viewBox.scale} height={viewBox.height} width={viewBox.width} />
						</>
					)}
				</LayerLevel>
				{active && (
					<LayerLevel
						onMouseUp={handleMouseUp}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
					/>
				)}
			</Container>
		</Viewport>
	);
};
