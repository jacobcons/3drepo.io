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

const RoutesManager = {};
const AadRoutes = require('./sso/aad');
const ContainerRevisionRoutes = require('./teamspaces/projects/containers/revisions');
const ContainerRoutes = require('./teamspaces/projects/containers/containers');
const ContainerViewsRoutes = require('./teamspaces/projects/containers/views');
const CreateGroupRoutes = require('./teamspaces/projects/models/common/groups');
const CreateTicketRoutes = require('./teamspaces/projects/models/common/tickets');
const FederationRevisionRoutes = require('./teamspaces/projects/federations/revisions');
const FederationRoutes = require('./teamspaces/projects/federations/federations');
const FederationViewsRoutes = require('./teamspaces/projects/federations/views');
const MetadataRoutes = require('./teamspaces/projects/containers/metadata');
const ProjectRoutes = require('./teamspaces/projects/projects');
const TeamspaceJobRoutes = require('./teamspaces/jobs');
const TeamspaceRoutes = require('./teamspaces/teamspaces');
const TeamspaceSettingsRoutes = require('./teamspaces/settings');

const UserRoutes = require('./users');

RoutesManager.init = (app) => {
	// Auth
	app.use('/v5/', UserRoutes);

	// Single Sign On
	app.use('/v5/sso/aad', AadRoutes);

	app.use('/v5/teamspaces/', TeamspaceRoutes);
	app.use('/v5/teamspaces/:teamspace/settings', TeamspaceSettingsRoutes);
	app.use('/v5/teamspaces/:teamspace/jobs', TeamspaceJobRoutes);
	app.use('/v5/teamspaces/:teamspace/projects', ProjectRoutes);

	// Containers
	app.use('/v5/teamspaces/:teamspace/projects/:project/containers', ContainerRoutes);
	app.use('/v5/teamspaces/:teamspace/projects/:project/containers/:model/tickets', CreateTicketRoutes());
	app.use('/v5/teamspaces/:teamspace/projects/:project/containers/:model/groups', CreateGroupRoutes());
	app.use('/v5/teamspaces/:teamspace/projects/:project/containers/:container/views', ContainerViewsRoutes);
	app.use('/v5/teamspaces/:teamspace/projects/:project/containers/:container/revisions', ContainerRevisionRoutes);
	app.use('/v5/teamspaces/:teamspace/projects/:project/containers/:container/metadata', MetadataRoutes);

	// Federations
	app.use('/v5/teamspaces/:teamspace/projects/:project/federations', FederationRoutes);
	app.use('/v5/teamspaces/:teamspace/projects/:project/federations/:model/tickets', CreateTicketRoutes(true));
	app.use('/v5/teamspaces/:teamspace/projects/:project/federations/:model/groups', CreateGroupRoutes(true));
	app.use('/v5/teamspaces/:teamspace/projects/:project/federations/:federation/views', FederationViewsRoutes);
	app.use('/v5/teamspaces/:teamspace/projects/:project/federations/:federation/revisions', FederationRevisionRoutes);
};

module.exports = RoutesManager;
