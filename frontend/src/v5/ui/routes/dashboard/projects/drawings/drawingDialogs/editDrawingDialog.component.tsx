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
import { SubmitHandler } from 'react-hook-form';
import { FormModal } from '@controls/formModal/formModal.component';
import { ProjectsHooksSelectors, TeamspacesHooksSelectors } from '@/v5/services/selectorsHooks';
import { DrawingsActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { IFormInput, useDrawingForm } from './drawingsDialogs.hooks';
import { IDrawing } from '@/v5/store/drawings/drawings.types';
import { dirtyValuesChanged } from '@/v5/helpers/form.helper';
import { pick } from 'lodash';
import { DrawingForm } from './drawingForm.component';
import { useEffect } from 'react';
import { Loader } from '@/v4/routes/components/loader/loader.component';

interface Props { 
	open: boolean; 
	onClickClose: () => void;
	drawing: IDrawing
}

export const EditDrawingDialog = ({ open, onClickClose, drawing }:Props) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const project = ProjectsHooksSelectors.selectCurrentProject();

	const { onSubmitError, formData } = useDrawingForm(drawing);
	const { handleSubmit, formState } = formData;

	const onSubmit: SubmitHandler<IFormInput> = async (body) => {
		try {
			await new Promise<void>((accept, reject) => {
				const updatedDrawingData = pick(body, ['name', 'number', 'type', 'desc']);
				DrawingsActionsDispatchers.updateDrawing(teamspace, project, drawing._id, updatedDrawingData, accept, reject);
			});
			onClickClose();
		} catch (err) {
			onSubmitError(err);
		}
	};

	useEffect(() => {
		DrawingsActionsDispatchers.fetchCalibration(teamspace, project, drawing._id);
	}, []);

	return (
		<FormModal
			open={open}
			title={formatMessage({ id: 'drawings.edit.title', defaultMessage: 'Drawing Settings' })}
			onClickClose={!formState.isSubmitting ? onClickClose : null}
			onSubmit={handleSubmit(onSubmit)}
			confirmLabel={formatMessage({ id: 'drawings.edit.ok', defaultMessage: 'Save Drawing' })}
			maxWidth="sm"
			{...formState}
			isValid={dirtyValuesChanged(formData, drawing) && formState.isValid}
		>
			{drawing.calibration.units
				? <DrawingForm formData={formData} drawing={drawing} />
				: <Loader />
			}
		</FormModal>
	);
};