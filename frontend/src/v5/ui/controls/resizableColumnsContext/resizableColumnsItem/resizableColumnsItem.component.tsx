/**
 *  Copyright (C) 2025 3D Repo Ltd
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

import { memo, useContext } from 'react';
import { ResizableColumnsContext } from '../resizableColumnsContext';
import { Container, Item, ResizerMouseLandingArea, ResizerLine } from './resizableColumnsItem.styles';
import { useResizable } from '../useResizable';

const MemoizedItem = memo(
	({ children, className }: any) => <Item className={className}>{children}</Item>,
	(prevProps, nextProps) => (
		prevProps.children === nextProps.children
		&& prevProps.className === nextProps.className
	),
);

type ResizableColumnsItemProps = {
	children: any;
	name: string;
	hidden?: boolean;
	className?: string;
};
export const ResizableColumnsItem = ({ name, children, className, hidden = false }: ResizableColumnsItemProps) => {
	const { setWidth, getWidth, setIsResizing, isResizing, setResizerName, resizerName } = useContext(ResizableColumnsContext);
	const currentWidth = getWidth(name);
	const onMouseDown = useResizable({
		onResizeStart: () => {
			setIsResizing(true);
			setResizerName(name);
		},
		onResize: (offset) => setWidth(name, currentWidth + offset),
		onResizeEnd: () => {
			setIsResizing(false);
			setResizerName('');
		},
	});

	const handleMouseOver = () => setResizerName(name);
	const handleMouseOut = () => {
		if (!isResizing) setResizerName('');
	};

	if (hidden) return null;

	return (
		<Container $width={currentWidth}>
			<MemoizedItem className={className}>{children}</MemoizedItem>
			<ResizerLine
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
				$isResizing={isResizing}
				$highlight={resizerName === name}
			>
				<ResizerMouseLandingArea onMouseDown={onMouseDown} />
			</ResizerLine>
		</Container>
	);
};
