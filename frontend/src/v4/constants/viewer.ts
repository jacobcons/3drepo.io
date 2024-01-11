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

export const VIEWER_NAV_MODES = {
	HELICOPTER: 'HELICOPTER',
	TURNTABLE: 'TURNTABLE'
} as const;

export const VIEWER_CLIP_MODES = {
	SINGLE: 'SINGLE',
	BOX: 'BOX'
} as const;

export const VIEWER_GIZMO_MODES = {
	TRANSLATE: 'TRANSLATE',
	ROTATE: 'ROTATE',
	SCALE: 'SCALE'
} as const;

export const VIEWER_MAP_SOURCES = {
	OSM: 'OSM',
	HERE: 'HERE',
	HERE_AERIAL: 'HERE_AERIAL',
	HERE_TRAFFIC: 'HERE_TRAFFIC',
	HERE_TRAFFIC_FLOW: 'HERE_TRAFFIC_FLOW'
};

export const VIEWER_EVENTS = {
	ADD_PIN: 'VIEWER_ADD_PIN',
	ALL_MEASUREMENTS_REMOVED: 'ALL_MEASUREMENTS_REMOVED',
	BACKGROUND_SELECTED_PIN_MODE: 'BACKGROUND_SELECTED_PIN_MODE',
	BACKGROUND_SELECTED: 'VIEWER_BACKGROUND_SELECTED',
	BBOX_READY: 'BBOX_READY',
	CAMERA_PROJECTION_SET: 'CAMERA_PROJECTION_SET',
	CLEAR_CLIPPING_PLANES: 'VIEWER_CLEAR_CLIPPING_PLANES',
	CLEAR_HIGHLIGHT_OBJECTS: 'VIEWER_CLEAR_HIGHLIGHT_OBJECTS',
	CLICK_PIN: 'VIEWER_CLICK_PIN',
	CLIPPING_PLANE_BROADCAST: 'VIEWER_CLIPPING_PLANE_BROADCAST',
	CLIPPING_PLANE_READY: 'VIEWER_CLIPPING_PLANE_READY',
	ENTER_VR: 'VIEWER_EVENT_ENTER_VR',
	GET_CURRENT_OBJECT_STATUS: 'VIEWER_GET_CURRENT_OBJECT_STATUS',
	GET_CURRENT_VIEWPOINT: 'VIEWER_GET_CURRENT_VIEWPOINT',
	GET_SCREENSHOT: 'VIEWER_GET_SCREENSHOT',
	GO_HOME: 'VIEWER_GO_HOME',
	HIGHLIGHT_OBJECTS: 'VIEWER_HIGHLIGHT_OBJECTS',
	INITIALISE: 'VIEWER_EVENT_INITIALISE',
	LOAD_MODEL: 'VIEWER_LOAD_MODEL',
	LOADED: 'VIEWER_EVENT_LOADED',
	LOGO_CLICK: 'VIEWER_LOGO_CLICK',
	MEASURE_MODE_CLICK_POINT: 'VIEWER_MEASURE_MODE_CLICK_POINT',
	MEASUREMENT_CREATED: 'MEASUREMENT_CREATED',
	MEASUREMENT_MODE_CHANGED:  'MEASUREMENT_MODE_CHANGED',
	MEASUREMENT_REMOVED: 'MEASUREMENT_REMOVED',
	MODEL_LOADED: 'MODEL_LOADED',
	MODEL_LOADING_CANCEL: 'MODEL_LOADING_CANCEL',
	MODEL_LOADING_PROGRESS: 'MODEL_LOADING_PROGRESS',
	MODEL_LOADING_START: 'MODEL_LOADING_START',
	MOVE_PIN: 'VIEWER_MOVE_PIN',
	MOVE_POINT: 'VIEWER_MOVE_POINT',
	MULTI_OBJECTS_SELECTED: 'VIEWER_MULTI_OBJECTS_SELECTED',
	NAV_MODE_CHANGED: 'NAV_MODE_CHANGED',
	OBJECT_SELECTED: 'VIEWER_OBJECT_SELECTED',
	PICK_POINT: 'VIEWER_PICK_POINT',
	REGISTER_MOUSE_MOVE_CALLBACK: 'VIEWER_REGISTER_MOUSE_MOVE_CALLBACK',
	REGISTER_VIEWPOINT_CALLBACK: 'VIEWER_REGISTER_VIEWPOINT_CALLBACK',
	REMOVE_PIN: 'VIEWER_REMOVE_PIN',
	RUNTIME_READY: 'VIEWING_RUNTIME_READY',
	SET_CAMERA: 'VIEWER_SET_CAMERA',
	SET_NAV_MODE: 'VIEWER_SET_NAV_MODE',
	SET_PIN_VISIBILITY: 'VIEWER_SET_PIN_VISIBILITY',
	START_LOADING: 'VIEWING_START_LOADING',
	SWITCH_FULLSCREEN: 'VIEWER_SWITCH_FULLSCREEN',
	SWITCH_OBJECT_VISIBILITY: 'VIEWER_SWITCH_OBJECT_VISIBILITY',
	TOGGLE_PANEL: 'VIEWER_TOGGLE_PANEL',
	UNHIGHLIGHT_OBJECTS: 'VIEWER_UNHIGHLIGHT_OBJECTS',
	UNITY_ERROR: 'VIEWER_EVENT_UNITY_ERROR',
	UNITY_READY: 'VIEWER_EVENT_UNITY_READY',
	UPDATE_CLIP: 'VIEWER_UPDATE_CLIP',
	UPDATE_CLIP_EDIT: 'VIEWER_SET_CLIP_EDIT',
	UPDATE_CLIP_MODE: 'VIEWER_UPDATE_CLIP_MODE',
	UPDATE_CLIPPING_PLANES: 'VIEWER_UPDATE_CLIPPING_PLANE',
	VIEWER_INIT_FAILED: 'VIEWER_INIT_FAILED',
	VIEWER_INIT_PROGRESS: 'VIEWER_INIT_PROGRESS',
	VIEWER_INIT_SUCCESS: 'VIEWER_INIT_SUCCESS',
	VIEWER_INIT: 'VIEWER_INIT',
	VR_READY: 'VIEWER_EVENT_VR_READY',
};

export const VIEWER_ERRORS = {
	PIN_ID_TAKEN: 'VIEWER_PIN_ID_TAKEN'
};

export const DEFAULT_SETTINGS = {
	viewerBackgroundColor: [0.95, 0.96, 0.99],
	shadows: 'none',
	xray: true,
	caching: false,
	statistics: false,
	unityMemory: 0,
	nearPlane: 10,
	farPlaneSamplingPoints: 5,
	farPlaneAlgorithm: 'box',
	maxShadowDistance: 10000,
	numCacheThreads: 3,
	clipPlaneBorderWidth: 0.8,
	clipPlaneBorderColor: [0.02, 0.16, 0.32],
	memoryThreshold: 500,
	meshFactor: 1.3,
	maxNearPlane: -1,
	maxFarPlane: -1,
	fovWeight: 2,
	phBundleColor: [0, 0.757, 0.828],
	phBundleFadeDistance: 2,
	phBundleFadeBias: 0,
	phBundleFadePower: 80,
	phBundleFaceAlpha: 0.1,
	phBundleLineAlpha: 0.1,
	phElementColor: [0.0898, 0.168, 0.3008],
	phElementRenderingRadius: 0.1,
	phElementFaceAlpha: 0.05,
	phElementLineAlpha: 0.3,
};

export const VIEWER_PANELS = {
	METADATA: 'metadata',
	RISKS: 'risks',
	ISSUES: 'issues',
	GROUPS: 'groups',
	VIEWS: 'views',
	TREE: 'tree',
	COMPARE: 'compare',
	GIS: 'gis'
};

export const VIEWER_PROJECTION_MODES = {
	ORTHOGRAPHIC: 'orthographic',
	PERSPECTIVE: 'perspective'
} as const;

export const VIEWER_TOOLBAR_ITEMS = {
	HOME: 'Home',
	TURNTABLE: 'Turntable',
	HELICOPTER: 'Helicopter',
	PERSPECTIVE_VIEW: 'Perspective View',
	ORTHOGRAPHIC_VIEW: 'Orthographic View',
	SHOW_ALL: 'Show All',
	HIDE: 'Hide',
	ISOLATE: 'Isolate',
	CLEAR_OVERRIDE: 'Clear Override',
	FOCUS: 'Focus',
	CLIP: 'Clip',
	COORDVIEW: 'Show Coordinates',
	BIM: 'Attribute Data'
};

export const INITIAL_HELICOPTER_SPEED = 1;
export const MIN_HELICOPTER_SPEED = -99;
export const MAX_HELICOPTER_SPEED = 99;
export const NEW_PIN_ID = 'newPinId';

export const VIEWER_MEASURING_MODE = {
	POINT: 'PointPin',
	RAY_CAST: 'Raycast',
	MINIMUM_DISTANCE: 'MinimumDistance',
	SAM: 'SurfaceArea',
	CSAM: 'PolygonArea',
	POINT_TO_POINT: 'Point',
} as const;
