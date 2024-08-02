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

import { Point } from './types';

function distance2(a: Point, b: Point) {
	return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
}

export interface KDTreeAxis {
	lessEquals(p: Point): boolean;
	slice: number;
	sort(points: Point[]);
	next(): KDTreeAxis;
	compare(a: Point, b: Point): boolean;
	value(p: Point): number;
}

class KDTreeXAxis implements KDTreeAxis {
	slice: number;

	lessEquals(p: Point): boolean {
		return p.x <= this.slice;
	}

	sort(points: Point[]) {
		points.sort((a, b) => a.x - b.x);
	}

	next(): KDTreeAxis {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return new KDTreeYAxis();
	}

	compare(a: Point, b: Point): boolean {
		return a.x == b.x;
	}

	value(p: Point): number {
		return p.x;
	}
}

class KDTreeYAxis implements KDTreeAxis {
	slice: number;

	lessEquals(p: Point): boolean {
		return p.y <= this.slice;
	}

	sort(points: Point[]) {
		points.sort((a, b) => a.y - b.y);
	}

	next(): KDTreeAxis {
		return new KDTreeXAxis();
	}

	compare(a: Point, b: Point): boolean {
		return a.y == b.y;
	}

	value(p: Point): number {
		return p.y;
	}
}

export class KDTreeNode {
	axis: KDTreeAxis;

	left: KDTreeNode;

	right: KDTreeNode;

	points: Point[];

	leafNode() {
		return this.points != null;
	}

	constructor(points: Point[]) {
		this.points = points;
	}
}

export class KDTreeQueryResults {
	closestPoint: Point;
}

export class TraversalContext {

	position: Point;

	closestPoint: Point;

	closestPointDistance2: number;

	numNodesTraversed;

	numPointTests;

	constructor() {
		this.numNodesTraversed = 0;
		this.numPointTests = 0;
		this.closestPointDistance2 = Number.MAX_VALUE;
		this.closestPoint = null;
	}
}

export class KDTree {
	root: KDTreeNode;

	traverseLeaf(node: KDTreeNode, ctx: TraversalContext) {
		for (const p of node.points) {
			const d = distance2(p, ctx.closestPoint);
			if (d < ctx.closestPointDistance2) {
				ctx.closestPointDistance2 = d;
				ctx.closestPoint = p;
			}
			ctx.numPointTests++;
		}
	}

	traverseBranch(node: KDTreeNode, ctx: TraversalContext) {
		if (node.axis.lessEquals(ctx.position)) {
			this.traverseNode(node.left, ctx);
		} else {
			this.traverseNode(node.right, ctx);
		}
	}

	traverseNode(node: KDTreeNode, ctx: TraversalContext) {
		if (node.leafNode()) {
			this.traverseLeaf(node, ctx);
		} else {
			this.traverseBranch(node, ctx);
		}
		ctx.numNodesTraversed++;
	}

	query(p: Point): KDTreeQueryResults {
		const results = new KDTreeQueryResults();
		const ctx = new TraversalContext();
		ctx.position = p;
		return results;
	}
}


export type KDTreeOptions = {
	points: Point[],
	n: number, // Max number of points per leaf
};

export class KDTreeBuilder {

	points: Point[];

	n: number;

	constructor(options: KDTreeOptions) {
		this.points = options.points;
		this.n = Math.max(options.n, 3);
	}

	// Splits the node along the provided axis, and if successful assigns
	// the updated axis object to the node.
	splitNode(node: KDTreeNode, axis: KDTreeAxis): boolean {

		axis.sort(node.points);

		// Find the index to split at, considering that all entries may have
		// the same value in the axis.

		// All points that are less than *or equal to* the hyperline fall on
		// the left hand side of the split, and for the purposes of slice,
		// splitIndex should be the index just above splitValue.
		// For example, for the below...
		// 0, 0, 1, 2,   3, 8, 9, 10
		// splitValue would be 2, and splitIndex would be 4.

		const halfLength =  Math.floor(node.points.length * 0.5);
		let splitIndex = halfLength;
		let splitIndexFound = false;
		for (let i = 1; i < halfLength; i++) {

			// Find the first index for which the value changes (in either)
			// direction.

			if (!node.axis.compare(node.points[splitIndex], node.points[splitIndex + i])) {
				splitIndex += i;
				splitIndexFound = true;
				break;
			}

			if (!node.axis.compare(node.points[splitIndex], node.points[splitIndex - 1])) {
				splitIndex -= i;
				splitIndex++;
				splitIndexFound = true;
				break;
			}
		}

		if (!splitIndexFound) {
			// If we are here, all the points in the list are indentical (in
			// this axis, at least), so there is nothing to do.
			return false;
		}

		axis.slice = axis.value(node.points[splitIndex - 1]);

		// Otherwise we have found a split

		node.left = new KDTreeNode(node.points.slice(0, splitIndex));
		node.right = new KDTreeNode(node.points.slice(splitIndex, node.points.length));
		node.points = null;
		node.axis = axis;

		return true;
	}

	subdivide(node: KDTreeNode, axis: KDTreeAxis) {

		// Check if the node actually needs to be subdivided

		if (node.points.length < this.n) {
			return;
		}

		let split = this.splitNode(node, axis);

		// Only one other case here becaus we know there are only two axis types
		if (!split) {
			split = this.splitNode(node, axis.next());
		}

		// If we didn't split the node by now, it can't be split, so just return
		if (!split) {
			return;
		}

		// Otherwise try and split the child nodes recursively

		this.subdivide(node.left, node.axis.next());
		this.subdivide(node.right, node.axis.next());
	}

	build(): KDTree {
		const tree = new KDTree();
		const node = new KDTreeNode(this.points);
		tree.root = node;
		this.subdivide(tree.root, new KDTreeXAxis());
		return tree;
	}
}