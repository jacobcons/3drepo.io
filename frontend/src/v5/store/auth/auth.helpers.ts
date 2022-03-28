/**
 *  Copyright (C) 2022 3D Repo Ltd
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

export const USER_ALREADY_EXISTS = 'USER_EXISTS';

export const getRegistrationError = (error: any) => {
	const { data } = error.response;
	if (data.code === USER_ALREADY_EXISTS) return USER_ALREADY_EXISTS;
	if (data.message) return data.message;
	const [, message] = data.split(/<\/?pre>/);
	return message;
};
