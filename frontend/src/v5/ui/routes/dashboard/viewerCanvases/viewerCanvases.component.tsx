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

import { Viewer3D } from '@/v4/routes/viewer3D';
import { Viewer2D } from '@components/viewer/drawingViewer/viewer2D.component';
import { useLocation } from 'react-router-dom';
import { SplitPane, LeftPane } from './viewerCanvases.styles';
import { ViewerCanvasesContext } from '../../viewer/viewerCanvases.context';
import { useContext, useState } from 'react';
import { CalibrationContext } from '../projects/calibration/calibrationContext';
import { CalibrationHeader } from '../projects/calibration/calibrationHeader/calibrationHeader.component';
import { Calibration } from '../projects/calibration/calibration.component';
import { ViewerGui } from '@/v4/routes/viewerGui';

export const ViewerCanvases = () => {
	const { pathname } = useLocation();
	const { is2DOpen } = useContext(ViewerCanvasesContext);
	const { open: isCalibrating } = useContext(CalibrationContext);
	const [leftPanelRatio, setLeftPanelRatio] = useState(0.5);

	const dragFinish = (newSize) => setLeftPanelRatio(newSize / window.innerWidth);

	return (
		<>
			{isCalibrating && <CalibrationHeader />}
			<SplitPane
				split="vertical"
				size={is2DOpen ? leftPanelRatio * 100 + '%' : '100%'}
				onDragFinished={dragFinish}
			>
				<LeftPane>
					<Viewer3D location={{ pathname }} />
					{isCalibrating && <Calibration />}
					<ViewerGui />
				</LeftPane>
				{is2DOpen && <Viewer2D />}
			</SplitPane>
		</>
	);
};
