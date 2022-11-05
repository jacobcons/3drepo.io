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

import { formatMessage } from '@/v5/services/intl';
import { NoResults, SearchInput, SearchInputContainer } from '@controls/formSelect/formSearchSelect/formSearchSelect.styles';
import { SearchContext, SearchContextComponent, SearchContextType } from '@controls/search/searchContext';
import { SelectWithLabel, SelectWithLabelProps } from '@controls/selectWithLabel/selectWithLabel.component';
import { MenuItem } from '@mui/material';
import { ReactNode } from 'react';
import { onlyText } from 'react-children-utilities';
import { FormattedMessage } from 'react-intl';

export const SearchSelect = ({ children, ...props }: SelectWithLabelProps) => {
	const preventPropagation = (e) => {
		if (e.key !== 'Escape') {
			e.stopPropagation();
		}
	};

	const filterItems = (items, query: string) => items
		.filter((node) => onlyText(node).toLowerCase()
			.includes(query.toLowerCase()));

	return (
		<SearchContextComponent filteringFunction={filterItems} items={children as ReactNode[]}>
			<SearchContext.Consumer>
				{ ({ filteredItems }: SearchContextType<typeof MenuItem>) => (
					<SelectWithLabel {...props}>
						<SearchInputContainer>
							<SearchInput
								placeholder={formatMessage({ id: 'searchSelect.searchInput.placeholder', defaultMessage: 'Search...' })}
								onClick={preventPropagation}
								onKeyDown={preventPropagation}
							/>
						</SearchInputContainer>
						{filteredItems.length > 0 && filteredItems}
						{!filteredItems.length && (
							<NoResults>
								<FormattedMessage
									id="form.searchSelect.menuContent.emptyList"
									defaultMessage="No results"
								/>
							</NoResults>
						)}
					</SelectWithLabel>
				)}
			</SearchContext.Consumer>
		</SearchContextComponent>
	);
};
