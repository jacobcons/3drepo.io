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
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Loader } from '@/v4/routes/components/loader/loader.component';
import { CentredContainer } from '@controls/centredContainer';

type Transform = {
	x: number;
	y: number;
	scale: number;
};

export type Size = {
	width: number;
	height: number;
};

export type Position = {
	x: number;
	y: number;
};

export type ZoomableImage = {
	setTransform: (transform: Transform) => void;
	getEventsEmitter: () => HTMLElement;
	getBoundingClientRect: () => DOMRect;
	getNaturalSize: () => Size;
	setSize: (size: Size) => void;
	copyRegion: (ctx: CanvasRenderingContext2D, sx: number, sy: number, w: number, h: number) => void;
	getImagePosition: (contentPosition: Position) => Position;
};

export type DrawingViewerImageProps = {
	onLoad?: (...args) => void,
	src: string
};
export const DrawingViewerImage = forwardRef<ZoomableImage, DrawingViewerImageProps>(({ onLoad, src }, ref ) => {
	const [isLoading, setIsLoading] = useState(true);
	const imgRef = useRef<HTMLImageElement>();

	useEffect(() => {
		setIsLoading(true);
	}, [src]);

	const onInternalLoad = (ev) => {
		setIsLoading(false);
		onLoad(ev);
	};

	(ref as any).current = {
		setTransform: ({ scale, x, y }) => {
			imgRef.current.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})`;
		},

		getEventsEmitter: () => {
			return imgRef.current.parentElement;
		},

		getBoundingClientRect: () => {
			return imgRef.current.getBoundingClientRect();
		},

		getNaturalSize: () =>  {
			const img = imgRef.current;
			return { width: img.naturalWidth, height: img.naturalHeight };
		},

		setSize: ({ width, height }: Size ) => {
			const img = imgRef.current;
			img.setAttribute('width', width + 'px');
			img.setAttribute('height', height + 'px');
		},
	};

	return (
		<>
			{
				isLoading &&
				<CentredContainer>
					<Loader />
				</CentredContainer>
			}
			<img src={src} onLoad={onInternalLoad} ref={imgRef} style={{ transformOrigin: '0 0', userSelect: 'none' }} draggable={false} />
		</>
	);
});