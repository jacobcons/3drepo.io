/**
 *  Copyright (C) 2021 3D Repo Ltd
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

import { PrimaryButton, SecondaryButton, ViewerButton } from './circleButton.styles';

interface ICircleButton {
	variant?: 'primary' | 'secondary' | 'viewer';
	disabled?: boolean;
	onClick?: (e) => void;
	children: any;
	active?: boolean;
}

export const CircleButton = ({ variant = 'primary', ...props }: ICircleButton) => {
	if (variant === 'primary') return (<PrimaryButton {...props} />);
	if (variant === 'viewer') return (<ViewerButton {...props} />);
	return (<SecondaryButton {...props} />);
};
