/**
 *  Copyright (C) 2017 3D Repo Ltd
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

import { COLOR } from '../../../styles';
import { initialBrushSize, initialTextSize} from './components/tools/tools.helpers';
import { MODES } from './markupStage/markupStage.helpers';

export const INITIAL_VALUES = {
	color: COLOR.RED,
	brushColor: COLOR.PRIMARY_DARK,
	brushSize: initialBrushSize(),
	textSize: initialTextSize(),
	mode: MODES.BRUSH
};

export const MODE_OPERATION = {
	brush: 'source-over',
	eraser: 'destination-out'
};

export const EDITABLE_TEXTAREA_NAME = 'editable-textarea';
export const EDITABLE_TEXTAREA_PLACEHOLDER = 'Type to change text...';
