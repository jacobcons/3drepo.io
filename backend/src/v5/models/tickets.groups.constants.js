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

const GroupConstants = {};

GroupConstants.idTypes = {
	IFC: 'ifc_guids',
	REVIT: 'revit_ids',
};

GroupConstants.idTypesToKeys = {
	[GroupConstants.idTypes.IFC]: ['IFC GUID', 'Ifc::IfcGUID', 'Element::IfcGUID'],
	[GroupConstants.idTypes.REVIT]: ['Element ID', 'Element ID::Value'],
};

module.exports = GroupConstants;
