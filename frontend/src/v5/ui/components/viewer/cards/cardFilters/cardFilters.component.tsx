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

import { useEffect, useState } from 'react';
import { TicketsFiltersList } from '../tickets/ticketsFiltersList/ticketsFiltersList.component';
import { CardFilterOperator } from './cardFilters.types';
import { FILTER_OPERATOR_ICON, getOperatorMaxValuesSupported } from './cardFilters.helpers';
import { get, set } from 'lodash';

export const CardFilters = () => {
	const [filters, setFilters] = useState({});
	
	const hasFilters = Object.keys(filters).length > 0;

	const onDeleteAllFilters = () => setFilters({});
	const onDeleteFilter = (module: string, property: string, operator: CardFilterOperator) => {
		const newFilters = { ...filters };
		delete newFilters[module][property][operator];
		if (!Object.values(newFilters[module][property]).length) {
			delete newFilters[module][property];
			if (!Object.values(newFilters[module]).length) {
				delete newFilters[module];
			}
		}
		setFilters(newFilters);
	};
	const addFilter = (module: string, property: string, operator: CardFilterOperator, value?: string | number | Date) => {
		const filterPath = [module, property, operator];
		switch (getOperatorMaxValuesSupported(operator)) {
			case 0:
				set(filters, filterPath, []);
				break;
			case 1:
				set(filters, filterPath, [value]);
				break;
			default:
				const currentVal = get(filters, filterPath, []);
				set(filters, filterPath, currentVal.concat(value));
		}
		setFilters({ ...filters });
	};

	// TODO - remove this
	const handleAddFilter = (e) => {
		e.preventDefault();
		const filter = e.target[0].value;
		const value = e.target[1].value;
		const isDate = e.target[2].checked;
		const filterPath = filter.split('.') as [string, string, CardFilterOperator];
		if  (filterPath.length !== 3) {
			alert("This will crash the app. Remeber: 'module'.'property'.'type'");
			return;
		}
		if  (!Object.keys(FILTER_OPERATOR_ICON).includes(filterPath.at(-1))) {
			alert('This will crash the app. This operator is not supported');
			return;
		}
		addFilter(...filterPath, isDate ? new Date(+value) : value);
	};

	// TODO - remove this
	useEffect(() => {
		setFilters({
			'': {
				'property1': {
					'rng': [new Date('12/12/2024'), new Date('12/20/2024')],
					'nrng': [3],
				},
				'property2': {
					'eq': [4],
				},
				'.assignees': {
					'ss': ['Ale', 'San', 'Dan'],
				},
			},
			'module1': {
				'property1': {
					'ex': [],
					'ss': [2, 3],
				},
			},
		});
	}, []);

	return (
		<>
			<form onSubmit={handleAddFilter}>
				filter: <input name="filter" placeholder='module.property.type' />
				<br />
				value: <input name="value" placeholder='value'/>
				<br />
				<label>
					is Date:
					<input type='checkbox' /> (if yes, convert to `new Date(+value)`)
				</label>
				<br />
				<button>[submit]</button>
			</form>
			{hasFilters && (
				<TicketsFiltersList
					filters={filters}
					onDeleteAllFilters={onDeleteAllFilters}
					onDeleteFilter={onDeleteFilter}
				/>
			)}
		</>
	);
};
