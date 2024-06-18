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

import { useContext, useEffect } from 'react';
import { CalibrationContext } from '../calibrationContext';
import { Calibration2DStep } from './calibration2DStep/calibration2DStep.component';
import { VerticalSpatialBoundariesStep } from './verticalSpatialBoundariesStep/verticalSpatialBoundariesStep.component';
import { ViewerCanvasesContext } from '@/v5/ui/routes/viewer/viewerCanvases.context';

export const CalibrationStep = () => {
	const { step } = useContext(CalibrationContext);
	const { setLeftPanelRatio } = useContext(ViewerCanvasesContext);
	const show2DViewer = step < 2;

	useEffect(() => {
		setLeftPanelRatio(show2DViewer ? .5 : 1);
	}, [show2DViewer]);

	switch (step) {
		case 0: return null;
		case 1: return <Calibration2DStep />;
		default: return <VerticalSpatialBoundariesStep />;
	}
};
