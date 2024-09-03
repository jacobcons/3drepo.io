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

import { formatMessage } from '@/v5/services/intl';
import WarningIcon from '@assets/icons/outlined/warning-outlined.svg';
import CalibratedIcon from '@assets/icons/filled/calibration-filled.svg';
import NotCalibrated from '@assets/icons/filled/no_calibration-filled.svg';
import { Display } from '@/v5/ui/themes/media';
import { CalibrationStates, DrawingStats, DrawingUploadStatus, IDrawing, MinimumDrawing } from './drawings.types';
import { getNullableDate } from '@/v5/helpers/getNullableDate';
import { getState } from '@/v4/modules/store';
import { selectActiveRevisions, selectLastRevision, selectRevisionsPending } from './revisions/drawingRevisions.selectors';

export const DRAWING_LIST_COLUMN_WIDTHS = {
	name: {
		// width: 234,
		minWidth: 90,
	},
	revisionsCount: {
		width: 155,
		hideWhenSmallerThan: Display.Desktop,
	},
	calibration: {
		width: 155,
		hideWhenSmallerThan: Display.Tablet,
	},
	number: {
		width: 260,
	},
	type: {
		width: 120,
		hideWhenSmallerThan: Display.Desktop,
	},
	lastUpdated: {
		width: 120,
	},
	actions: {
		width: 84,
	},
};

export const DRAWINGS_SEARCH_FIELDS = ['name', 'latestRevision', 'type', 'number', 'status'];

export const CALIBRATION_MAP = {
	[CalibrationStates.CALIBRATED]: {
		label: formatMessage({ id: 'drawings.calibration.calibrated', defaultMessage: 'Calibrated' }),
		icon: <CalibratedIcon />,
	},
	[CalibrationStates.OUT_OF_SYNC]: {
		label: formatMessage({ id: 'drawings.calibration.outOfSync', defaultMessage: 'Calibrated' }),
		icon: <WarningIcon />,
	},
	[CalibrationStates.UNCALIBRATED]: {
		label: formatMessage({ id: 'drawings.calibration.uncalibrated', defaultMessage: 'Uncalibrated' }),
		icon: <NotCalibrated />,
	},
	[CalibrationStates.EMPTY]: {
		label: formatMessage({ id: 'drawings.calibration.empty', defaultMessage: 'Empty' }),
		icon: <NotCalibrated />,
	},
};
// TODO - fix (if necessary) when backend is available
export const canUploadToBackend = (status?: DrawingUploadStatus): boolean => {
	const statusesForUpload = [
		DrawingUploadStatus.OK,
		DrawingUploadStatus.FAILED,
	];

	return statusesForUpload.includes(status);
};

export const fullDrawing = (
	drawing: MinimumDrawing,
	stats?: DrawingStats,
): IDrawing => {
	const state = getState();
	const isPendingRevisions = selectRevisionsPending(state, drawing._id);
	const activeRevisions = selectActiveRevisions(state, drawing._id);
	const latestRevision = isPendingRevisions ? stats?.revisions?.latestRevision : selectLastRevision(state, drawing._id);
	const revisionsCount = isPendingRevisions ? stats?.revisions?.total : activeRevisions.length;
	const calibration = revisionsCount > 0 ? stats?.calibration : CalibrationStates.EMPTY;
	const lastUpdated = isPendingRevisions ? stats?.revisions.lastUpdated :  (activeRevisions[0] || {}).timestamp;

	const res = {
		...drawing,
		revisionsCount,
		lastUpdated: getNullableDate(lastUpdated), 
		latestRevision,
		number: stats?.number ?? '',
		type: stats?.type ?? '',
		desc: stats?.desc ?? '',
		calibration, 
		status: stats?.status ?? DrawingUploadStatus.OK,
		hasStatsPending: !stats,
		errorReason: stats?.errorReason && {
			message: stats.errorReason.message,
			timestamp: getNullableDate(+stats?.errorReason.timestamp),
		} };

	return res;
};