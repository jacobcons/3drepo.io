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
import { DrawingsHooksSelectors } from '@/v5/services/selectorsHooks';
import { useSearchParam } from '@/v5/ui/routes/useSearchParam';
import CameraIcon from '@assets/icons/viewer/camera.svg';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Viewer as ViewerService } from '@/v4/services/viewer/viewer';

export const Camera = ({ scale }) => {
	const animationFrame = useRef(0);
	const viewpoint = useRef(null);
	const cameraRef = useRef<HTMLElement>();
	
	const [drawingId] = useSearchParam('drawingId');
	const { containerOrFederation } = useParams();
	const [position, setPosition] = useState({ x:0, y:0 });
	const [angle, setAngle] = useState(0);
	const transform2DTo3D = DrawingsHooksSelectors.selectTransform2Dto3D(drawingId, containerOrFederation);
	const transform3DTo2D = DrawingsHooksSelectors.selectTransform3Dto2D(drawingId, containerOrFederation);


	const onEnterFrame = async () => {
		const v = await ViewerService.getCurrentViewpointInfo();
		const p =  transform3DTo2D(v.position);
		setPosition(p);

		const lookat = transform3DTo2D(v.look_at);
		lookat.sub(p);
		setAngle(lookat.angle());

		viewpoint.current = v;
	
		animationFrame.current = requestAnimationFrame(onEnterFrame);
	};


	useEffect(() => {
		if (!transform2DTo3D) return;

		animationFrame.current = requestAnimationFrame(onEnterFrame);
		return () => {
			cancelAnimationFrame(animationFrame.current);
		};
	}, [transform2DTo3D]);


	const getCursorOffset = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;
		return [ offsetX / scale, offsetY / scale];
	};

	const onMouseMove = async (ev: MouseEvent) => {
		ev.stopPropagation();

		const point = getCursorOffset(ev);


		const pp =  transform2DTo3D(point);
		const {
			up,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			view_dir,
			position:pos, type } = viewpoint.current;

		const cam = {
			position: [pp.x,  pos[1], pp.y ],
			view_dir,
			up,
			type, 
			look_at: undefined, 
			orthographicSize: undefined, 
			account: undefined, 
			model: undefined,
		};


		ViewerService.setCamera(cam);
	};

	const onMouseUp = (ev: MouseEvent) => {
		ev.currentTarget.removeEventListener('mousemove', onMouseMove);
	};

	const onMouseDown: React.MouseEventHandler<SVGSVGElement> = (ev) => {
		ev.stopPropagation();
		ev.nativeEvent.stopPropagation();
		ev.nativeEvent.stopImmediatePropagation();


		ev.currentTarget.parentElement.addEventListener('mousemove', onMouseMove);
		ev.currentTarget.parentElement.addEventListener('mouseup', onMouseUp);
	};

	if (!transform2DTo3D) {
		return null;
	}

	return (<CameraIcon iconRef={cameraRef as any} onMouseDown={onMouseDown}  style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${1 / scale}) rotate(${angle}rad)`, overflow:'unset', cursor:'grab', transformOrigin: '0 0' }}/>);
};