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

import { useRef, useEffect, forwardRef } from 'react';
import { ZoomableImage, DrawingViewerImageProps } from '../drawingViewerImage/drawingViewerImage.component';

type Transform = { x:number, y:number, scale:number };
type Vector2 = { x:number, y:number };
type Size = { width: number, height: number };

export const pannableSVG = (container: HTMLElement, src: string) => {

	// The pannableSVG attemps to provide quick feedback by drawing a larger
	// region of the image than the user actually sees, and using the (fast)
	// DOM transform to immediately respond to transform changes, while the
	// (slow) repaint of the canvas takes place in the background.

	// transform is the users transform. This is combined with origin to make
	// the transform-origin appear at the top-left of the viewport.

	// origin is the initial transform that places the top-left of the image
	// at the top-left of the viewport, by adding a band of whitespace around
	// the canvas.

	// D is the desired transform of the svg relative to the canvas, when the
	// canvas is centered in the viewport.

	// projection is the current transform of the svg as painted, relative to
	// the canvas. When this doesn't mach D exactly, the difference is applied
	// to the canvas transform via the DOM, so they appear identical to the
	// user.

	// While origin, D and projection are defined in canvas space, it is easier
	// to think of the canvas as a 'viewport' into the svg. When repainting, the
	// whole canvas is used as the destination rect, and the inverse of D defines
	// the source rect (see drawImage). For example, the origin offset appears
	// to createImageBitmap as a negative source position, which is why the top
	// left of the canvas appears blank after painting.

	let transform: Transform = { x: 0, y: 0, scale: 1 };
	let origin: Transform;
	let D : Transform;
	let projection: Transform;
	let tframe = 0;
	let drawing = false;
	let onLoad: any;

	const img = new Image();

	// The overdraw for the Canvas, as a scalar. Overdraw means to create a
	// larger canvas than is displayed in the containing element. This allows
	// the user to pan without seeing missing parts of the image as they are
	// already rendered offscreen.
	// Larger overdraw allows the user to pan farther without missing anything,
	// but requires a larger canvas, and so more memory and more time to
	// repaint.

	const overdraw = 2;

	// The canvas will show the drawing. The canvas can move inside its parent
	// element to enable fast panning and zooming, but afterwards a re-paint
	// should occur.

	let canvas = document.createElement('canvas');
	let context = canvas.getContext('bitmaprenderer');

	// This will be used to set the initial size, and on any resize of the
	// parent container.

	const getViewSize = () => {
		return {
			width: container.clientWidth,
			height: container.clientHeight,
		};
	};

	const getCanvasSize = () => {
		// The canvas size should be a multiple of the viewport

		const view = getViewSize(); // From container's current state

		// Since we only have a single parameter for scale, the canvas must
		// be square.

		const dim = Math.max(view.width, view.height);
		return {
			width: Math.ceil(dim * overdraw),
			height: Math.ceil(dim * overdraw),
		};
	};

	// The canvas is the actual element in the DOM that will show the image

	container.appendChild(canvas);

	/**
	 * Work out the origin transform that ensures that when the svg is painted
	 * it appears at the top-left of the viewport.
	 */
	const calculateProjection = (view: Size, cnvs: Size ) : Transform => {
		// The image starts at its native scale
		const scale = 1;

		// The overdrawn canvas is always centered on the viewport,
		// so subtract the viewport from the canvas size to get the
		// whitespace offset of the initial projection
		const x = (cnvs.width - view.width) * 0.5;
		const y = (cnvs.height - view.height) * 0.5;

		// Create a new projection transform with unit scale
		let proj: Transform = { x, y, scale };

		return proj;
	};

	/**
	 * Compose transform b with a, so that transforming an entity is the
	 * equivalent of transforming it by a, then by b.
	 */
	const compose = (a: Transform, b: Transform) : Transform => {
		return {
			x: (a.x * b.scale) + b.x,
			y: (a.y * b.scale) + b.y,
			scale: a.scale * b.scale,
		};
	};

	/**
	 * Returns a transform that undoes transform a. Composing a with its inverse,
	 * or its inverse with a will result in an identity transform.
	 */
	const invert = (a: Transform) : Transform => {
		return {
			x: -a.x / a.scale,
			y: -a.y / a.scale,
			scale: 1 / a.scale,
		};
	};

	/**
	 * Get the transform that goes from a onto b. Multiplying a composition
	 * of a with this transform will be the equivalent of multiplying with
	 * b directly.
	 */
	const difference = (a: Transform, b: Transform) : Transform => {
		return compose(invert(a), b);
	};


	/**
	 * Applies transform a to the vector v/transforms v by a.
	 */
	const multiply = (a: Transform, v: Vector2): Vector2 => {
		return {
			x: (v.x * a.scale) + a.x,
			y: (v.y * a.scale) + a.y,
		};
	};

	// Do some checks, these should be put in unit tests going forward...
	// --

	let a: Transform = { x: 1, y: 1, scale: 2 };
	let b: Transform = { x: 5, y: 5, scale: 3 };
	const v1: Vector2 = { x: 1, y: 1 };

	const A = compose(invert(a), a);
	const B = compose(a, invert(a));

	// both A & B should be identity, because a transform composed with its inverse is identity

	const c1 = multiply(a, v1);
	const c2 = multiply(b, c1);
	const c3 = multiply(compose(a, b), v1);

	// c2 should equal c3, because v1 multiplied by a, then b, should be the same as it multiplied by the composition of a and b

	const c4 = multiply(invert(b), c3);

	// and c4 should equal c1, because c3 is a composition of a and b, so removing b should return it to v1 multiplied by a

	const c5 = multiply(b, v1);
	const c6 = difference(a, b);
	const c7 = multiply(compose(a, c6), v1);

	// c7 should equal c5, because difference gets the transform between a and b, so multipling c1 with the composition of a and this, is the same
	// as multiplying it with b.

	// --

	/**
	* Gets a transform in a form that can be applied as a style attribute
	*/
	const getCSStransform = (t: Transform) => {
		return `translate(${t.x}px, ${t.y}px) scale(${t.scale}, ${t.scale})`;
	};

	/**
	 * Gets the transform that manifests the difference between Projection and
	 * D, as a Transform. This method returns the exact transform that should
	 * be applied to the Canvas object given the current Projection, including
	 * the overdraw.
	 */
	const getCanvasTransform = () => {
		const dt = difference(projection, D);
		const overdrawOffset = {
			x: -origin.x,
			y: -origin.y,
			scale: 1,
		};
		return compose(dt, overdrawOffset);
	};

	/**
	 * Update the Canvas transform to manifest the difference between Projection
	 * and D, and apply it as a CSS style attribute. This method will also apply
	 * the centering for the overdraw, which should not be part of D.
	 */
	const updateCanvasTransform = () => {
		const dt = getCanvasTransform();
		canvas.setAttribute('style', `transform: ${getCSStransform(dt)}; transform-origin: top left; user-select:none`);
	};

	/**
	 * Rasterises the current image into the canvas with the given projection
	 */
	const drawImage = (t: Transform, ctx: ImageBitmapRenderingContext, resolve: any) => {

		// This function uses drawImage to project img into canvas, by working
		// out the appropriate source rect to draw into the full canvas.

		// To get the source rect, the transform is 'inverted' to convert it
		// from canvas-space to natural-image-space.
		// These drawing methods take integers only, so round here explicitly
		// so we can be sure of the rounding behaviour.

		const sx = Math.round(-t.x / t.scale);
		const sy = Math.round(-t.y / t.scale);
		const sw = Math.round(ctx.canvas.width / t.scale);
		const sh = Math.round(ctx.canvas.height / t.scale);

		// Render asynchronously using createImageBitmap (does not work in Firefox)

		createImageBitmap(img, sx, sy, sw, sh, { resizeWidth: ctx.canvas.width, resizeHeight: ctx.canvas.height }).then((bm) => {
			// transferFromImageBitmap should take place almost immediately. An
			// alternative is to pass control of the canvas to a WebWorker and
			// have the bitmap exchanged there, though in that case it is harder
			// to synchronise the update of the style transform.

			ctx?.transferFromImageBitmap(bm);

			// When zoomed in very close, Canvas pixels may become smaller than
			// natural image pixels. However, the source region can only be
			// specified in natural image pixels.
			// Consequently, the true projection is that which is effected by the
			// rounded arguments to createImageBitmap or drawImage, not necessarily
			// the transform passed into the function.
			// Compute the actual projection below, ensuring any sub-natural-pixel
			// offets remain in the style transform after the diff, and the image
			// remains stable.

			const actualScale = ctx.canvas.width / sw;
			projection = {
				x: -sx * actualScale,
				y: -sy * actualScale,
				scale: actualScale,
			};

			if (resolve) {
				resolve();
			}
		});


		/* Render synchronously with drawImage
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
		ctx?.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
		projection = t;
		if(resolve){
			resolve();
		}
		*/
	};

	const onAnimationFrame = async () => {

		// Draw the image with the full desired projection

		const tn = tframe;

		// Flag that we are waiting on a render, which may take a number of
		// animation frames.
		drawing = true;

		drawImage(D, context, () => {
			updateCanvasTransform();

			// Check if we've updated the transform since the last render.
			// If so, issue the request again.
			if (tn !== tframe) {
				requestAnimationFrame(onAnimationFrame);
			} else {
				drawing = false;
			}
		});
	};

	// Creates a new canvas based on the current container size, and replaces
	// the current one - if any - with it when it is finished drawing.

	let currentCanvasRequest = 0;

	const createCanvas = () => {
		// Get the new canvas size based on the container size
		const viewSize = getViewSize();
		const canvasSize = getCanvasSize();

		// Compute a new origin for the user transforms to be applied on top of
		const intialProjection = calculateProjection(viewSize, canvasSize);

		// Create the canvas and context
		const newCanvas = document.createElement('canvas');
		newCanvas.width = canvasSize.width;
		newCanvas.height = canvasSize.height;
		const newCtx = newCanvas.getContext('bitmaprenderer');

		// Store the token to indicate what the current request is. If a callback
		// arrives after this has been updated, it will be ignored.
		const request = ++currentCanvasRequest;

		// Draw the image into the canvas
		drawImage(intialProjection, newCtx, () => {
			if (request != currentCanvasRequest) {
				return; // Some other callback will handle this...
			}

			// Replace the canvas and update the transforms for the outer context
			origin = intialProjection;
			projection = intialProjection;
			D = intialProjection;

			// Replace the canvas for the component and DOM
			if (canvas) {
				container.removeChild(canvas);
			}
			canvas = newCanvas;
			container.appendChild(canvas);
			context = newCtx;

			// Once projection, D & the canvas itself are replaced, we can use
			// this regular call to update the DOM transform
			updateCanvasTransform();
		});
	};

	// We will load the SVG into an image element, allowing it to interoperate
	// with CanvasRenderingContext. The SVG will for all intents and purposes
	// be a bitmap to our code, though behind the scenes the browser will
	// rasterise it based on the canvas size.

	let hasLoaded = false;

	img.src = src;
	img.onload = () => {

		hasLoaded = true;

		// Create a new canvas for the newly loaded image
		createCanvas();

		if (onLoad) {
			onLoad();
		}
	};

	const addEventListener = (method : string, callback) => {
		if (method.toLowerCase() == 'load') {
			onLoad = callback;
		}
	};

	// Initialise some properties that may get called before the first
	// draw call completes

	const setTransform = (t: Transform) => {
		if (t.x === transform.x && t.y === transform.y && t.scale === transform.scale) return;

		// This updates, but does not change the reference of, the absolute
		// transform that should be applied to the image.

		transform.x = t.x;
		transform.y = t.y;
		transform.scale = t.scale;

		// The user transform should behave as if it's origin is the top left
		// of the image when initially loaded.

		// As the origin always has a unit scale, this is a straightforward
		// offset.

		D = {
			x: origin.x + transform.x,
			y: origin.y + transform.y,
			scale: transform.scale,
		};

		// To show the desired transform to the user, get the remaining
		// difference between the current projection and it, and apply
		// it as css transform.

		updateCanvasTransform();

		tframe++;

		if (!drawing) {
			requestAnimationFrame(onAnimationFrame);
		}
	};

	const onResize = () => {
		// Ignore anything before the image loads, because we won't have an image size to work with

		if (!hasLoaded) {
			return;
		}

		// Update the canvas transform when resizing, to keep the image centered

		updateCanvasTransform();

		// After the container is resized, we need to rebuild the canvas, which
		// will involve redrawing the image.
		//createCanvas();
	};

	const resizeObserver = new ResizeObserver(onResize);
	resizeObserver.observe(container);

	return {
		set transform(t: Transform) {
			setTransform(t);
		},

		/**
		 * Updates the SVG. This sill start a new load and reset the projection.
		 */
		set src(s: string) {
			if (s === img.src) return;
			img.src = s;
		},

		addEventListener,

		// The actual image size depends on the projection, and remaining
		// Canvas transform. As far as outer components are aware, the
		// the true image size is the same as the viewport, with the
		// transform-origin at the top left.

		get naturalWidth() : number {
			return img.naturalWidth;
		},

		get naturalHeight() : number {
			return img.naturalHeight;
		},

		copyRegion(dctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number ) {
			// Convert from the parent coordinates to canvas coordinates.
			const t = invert(getCanvasTransform());
			const sourceCoords = multiply(t, { x, y });

			// Use drawImage to extract a region
			dctx.drawImage(canvas,
				sourceCoords.x,
				sourceCoords.y,
				w,
				h,
				0,
				0,
				w,
				h,
			);
		},

		// Given a coordinate relative to the content rect, get the coordinate
		// relative to the viewbox of the svg. This is straightforward in
		// principle, but internally most of the computations are done in canvas
		// space, so we get the position in canvas space, then transform into
		// SVG space through the inverse of D (which is SVG -> Canvas).

		localToSvg(p: Vector2): Vector2 {
			const contentToCanvas = invert(getCanvasTransform());
			const canvasToSvg = invert(D);
			const t = compose(contentToCanvas, canvasToSvg);
			return multiply(t, p);
		},
	};
};

export const SVGImage = forwardRef<ZoomableImage, DrawingViewerImageProps>(({ onLoad, src }, ref ) => {
	const containerRef = useRef<HTMLElement>();
	const pannableImage = useRef<ReturnType<typeof pannableSVG>>();

	useEffect(() => {
		if (!containerRef.current || pannableImage.current) return;
		pannableImage.current = pannableSVG(containerRef.current, src);
		pannableImage.current.addEventListener('load', onLoad);
	}, []);


	useEffect(() => {
		if (!pannableImage.current) return;
		pannableImage.current.src = src;
	}, [src]);


	(ref as React.MutableRefObject<ZoomableImage>).current = {
		setTransform: (t) => {
			if (!pannableImage.current) return;
			pannableImage.current.transform = t;
		},

		getEventsEmitter: () => {
			return containerRef.current;
		},

		getBoundingClientRect: () => {
			const bound = containerRef.current.getBoundingClientRect();
			// bound.x = transform.x;
			// bound.y = transform.y;
			// bound.width *= transform.scale;
			// bound.height *= transform.scale;
			return bound ;
		},

		getNaturalSize: () =>  {
			return { width: pannableImage.current.naturalWidth, height: pannableImage.current.naturalHeight };
		},

		setSize: ({ width, height }: Size ) => {},

		// Draws a region of the image into the provided context, given sx & sy
		// relative to the ZoomableImage's content rect.
		copyRegion: (ctx: CanvasRenderingContext2D, sx: number, sy: number, w: number, h: number) => {
			pannableImage.current.copyRegion(ctx, sx, sy, w, h);
		},

		// Given a coordinate in the content rect of the container, get the
		// position in the local coordinate frame of the SVG viewbox.
		getImagePosition(contentPosition: Vector2) {
			return pannableImage.current.localToSvg(contentPosition);
		},
	};

	return (<div ref={containerRef as any} style={{ height:'100%', overflow:'hidden' }} />);
});
