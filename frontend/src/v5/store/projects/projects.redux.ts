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

import { Action } from 'redux';
import { createActions, createReducer } from 'reduxsauce';
import { Constants } from '../../helpers/actions.helper';
import { IProject } from './projects.types';

export const { Types: ProjectsTypes, Creators: ProjectsActions } = createActions({
	fetch: ['teamspace'],
	fetchSuccess: ['teamspace', 'projects'],
	fetchFailure: [],
	setCurrentProject: ['projectId'],
	createProject: ['teamspace', 'projectName', 'onSuccess', 'onError'],
	createProjectSuccess: ['teamspace', 'project'],
	deleteProject: ['teamspace', 'projectId', 'onSuccess', 'onError'],
	deleteProjectSuccess: ['teamspace', 'projectId'],
}, { prefix: 'PROJECTS/' }) as { Types: Constants<IProjectsActions>; Creators: IProjectsActions };

export const INITIAL_STATE: IProjectsState = {
	projectsByTeamspace: {},
	currentProject: '',
};

export const fetchSuccess = (state = INITIAL_STATE, { teamspace, projects }): IProjectsState => ({
	...state,
	projectsByTeamspace: {
		...state.projectsByTeamspace,
		[teamspace]: projects,
	},
});

export const setCurrentProject = (state = INITIAL_STATE, { projectId }): IProjectsState => ({
	...state,
	currentProject: projectId,
});

export const createProjectSuccess = (state = INITIAL_STATE, { teamspace, project }): IProjectsState => ({
	...state,
	projectsByTeamspace: {
		...state.projectsByTeamspace,
		[teamspace]: [
			...state.projectsByTeamspace[teamspace],
			project,
		],
	},
});

export const deleteProjectSuccess = (state = INITIAL_STATE, { teamspace, projectId }): IProjectsState => ({
	...state,
	projectsByTeamspace: {
		...state.projectsByTeamspace,
		[teamspace]: state.projectsByTeamspace[teamspace].filter((project) => projectId !== project._id),
	},
});

export const projectsReducer = createReducer(INITIAL_STATE, {
	[ProjectsTypes.FETCH_SUCCESS]: fetchSuccess,
	[ProjectsTypes.SET_CURRENT_PROJECT]: setCurrentProject,
	[ProjectsTypes.CREATE_PROJECT_SUCCESS]: createProjectSuccess,
	[ProjectsTypes.DELETE_PROJECT_SUCCESS]: deleteProjectSuccess,
}) as (state: IProjectsState, action: any) => IProjectsState;

/**
 * Types
 */
export interface IProjectsState {
	projectsByTeamspace: Record<string, IProject[]>;
	currentProject: string;
}

export type CreateProjectAction = Action<'CREATE_PROJECT'> & { teamspace: string, projectName: string };
export type CreateProjectSuccessAction = Action<'CREATE_PROJECT_SUCCESS'> & { project: IProject };

export interface IProjectsActions {
	fetch: (teamspace: string) => any;
	fetchSuccess: (teamspace: string, projects: IProject[]) => any;
	fetchFailure: () => any;
	setCurrentProject: (projectId: string) => any;
	createProject: (
		teamspace: string,
		projectName: string,
		onSuccess: () => void,
		onError: (error) => void,
	) => CreateProjectAction;
	createProjectSuccess: (teamspace: string, project: IProject) => CreateProjectSuccessAction;
	deleteProject: (teamspace: string, projectId: string, onSuccess: () => void, onError: (error) => void) => any;
	deleteProjectSuccess: (teamspace: string, projectId: string) => any;
}
