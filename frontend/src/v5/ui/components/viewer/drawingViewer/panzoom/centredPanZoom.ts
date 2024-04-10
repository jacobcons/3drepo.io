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

import { aspectRatio } from '@/v4/helpers/aspectRatio';
import { PanZoom, panzoom } from './panzoom';

export type PanZoomHandler = PanZoom & { zoomIn : () => void, zoomOut: () => void };

export const centredPanZoom = (target: HTMLImageElement | SVGSVGElement, paddingW: number, paddingH: number) => {
	const targetContainer = target.parentElement;

	const originalSize = { width: 0, height: 0 };

	if (target.tagName.toLocaleLowerCase() === 'img') {
		const img:HTMLImageElement = target as HTMLImageElement;

		originalSize.width = img.naturalWidth;
		originalSize.height = img.naturalHeight;
	} else {
		const svg:SVGSVGElement = target as SVGSVGElement;
		originalSize.width = svg.viewBox.baseVal.width;
		originalSize.height = svg.viewBox.baseVal.height;
	}


	const options = {
		maxZoom: 10,
		minZoom: 1,
	};
	
	const pz = panzoom(target, options);

	let size = { scaledWidth: 0, scaledHeight:0 };

	const onTransform = () => {
		const parentRect = targetContainer.getBoundingClientRect();
		const actualPaddingW = (parentRect.width - size.scaledWidth) / 2 ;
		const actualPaddingH = (parentRect.height - size.scaledHeight ) / 2 ;
		const targetRect = target.getBoundingClientRect();
		const t = pz.getTransform();
		const maxX =  actualPaddingW * t.scale;
		const minX =  parentRect.width - targetRect.width - actualPaddingW * t.scale;


		const maxY =  actualPaddingH * t.scale;
		const minY =  parentRect.height - targetRect.height - actualPaddingH * t.scale;

		if (t.x > maxX || t.x < minX || t.y > maxY || t.y < minY) {
			const x = Math.max(Math.min(t.x, maxX), minX);
			const y = Math.max(Math.min(t.y, maxY), minY);
			pz.moveTo(x, y);
		}
	};


	const scaleTarget = () => {
		const parentRect = targetContainer.getBoundingClientRect();
		size = aspectRatio(originalSize.width, originalSize.height, parentRect.width - paddingW * 2, parentRect.height - paddingH * 2);
		target.setAttribute('width', size.scaledWidth + 'px');
		target.setAttribute('height', size.scaledHeight + 'px');
		onTransform();
	};

	const resizeObserver = new ResizeObserver(scaleTarget);
	resizeObserver.observe(targetContainer);

	pz.on('transform', onTransform);


	const zoom = (scale) => {
		const contRect = targetContainer.getBoundingClientRect();
		pz.smoothZoom(contRect.width / 2 + contRect.x, contRect.height / 2 + contRect.y, scale);
	};

	const zoomIn = () => zoom(1.5);

	const zoomOut = () => zoom(1 / 1.5);

	return { ...pz, zoomIn, zoomOut } ;
};
