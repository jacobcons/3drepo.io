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

import { withVersion } from '@/v4/helpers/withVersion';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
	selectModelsPermissions,
	selectProjectModels,
	selectSelectedModels,
	UserManagementActions
} from '../../modules/userManagement';
import { ModelsPermissions } from './modelsPermissions.component';

const mapStateToProps = createStructuredSelector({
	models: selectProjectModels,
	selectedModels: selectSelectedModels,
	permissions: selectModelsPermissions,
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
	onSelectionChange: UserManagementActions.fetchModelsPermissions,
	onPermissionsChange: UserManagementActions.updateModelsPermissionsPre
}, dispatch);

export default withVersion(withRouter(connect(mapStateToProps, mapDispatchToProps)(ModelsPermissions)));
