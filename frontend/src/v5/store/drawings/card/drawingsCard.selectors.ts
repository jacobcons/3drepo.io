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

import { createSelector } from 'reselect';
import { selectDrawings } from '../drawings.selectors';
import { IDrawingsCardState } from './drawingsCard.redux';
import { selectRevisions } from '../revisions/drawingRevisions.selectors';
import { CalibrationStatus } from '../drawings.types';

const selectDrawingsCardDomain = (state): IDrawingsCardState => state.drawingsCard || {};

const ValidStatuses = new Set([CalibrationStatus.CALIBRATED, CalibrationStatus.UNCONFIRMED]);


export const selectValidDrawings = createSelector(
	selectDrawings,
	(drawings) => drawings.filter((d) => ValidStatuses.has(d.calibrationStatus)),
);

export const selectQueries = createSelector(
	selectDrawingsCardDomain,
	(drawingCardState) => drawingCardState.queries || [],
);


export const selectDrawingsFilteredByQueries = createSelector(
	selectValidDrawings,
	selectQueries,
	(state) => (drawingId) => selectRevisions(state, drawingId),
	(drawings, queries, selectDrawingRevisions) => drawings.filter((drawing) => {
		if (!queries.length) return true;
		const [latestRevision] = selectDrawingRevisions(drawing._id);

		const fields = [
			drawing.desc,
			drawing.number,
			drawing.name,
			latestRevision?.statusCode,
			latestRevision?.revCode,
		].filter(Boolean);

		const drawingMatchesQuery = (query) => fields.some((str) => str.toLowerCase().includes(query.toLowerCase()));
		return queries.some(drawingMatchesQuery);
	}),
);
