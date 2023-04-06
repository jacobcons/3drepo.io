/**
 *  Copyright (C) 2023 3D Repo Ltd
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
import { PropertyDefinition } from '@/v5/store/tickets/tickets.types';
import { TicketDetailsAssignees } from '@controls/assignees/ticketDetailsAssignees/ticketDetailsAssignees.component';
import { PRIORITY_LEVELS_MAP, STATUS_MAP } from '@controls/chip/chip.types';
import { FormChipSelect, FormDueDateWithIcon } from '@controls/inputs/formInputs.component';
import { InputController } from '@controls/inputs/inputController.component';

import { FormattedMessage } from 'react-intl';
import { IssueProperties } from '../../../tickets.constants';
import { ColumnSeparator, FloatRight, IssuePropertiesContainer, PropertyColumn, PropertyTitle } from './issuePropertiesRow.styles';

type IIssuePropertiesRow = {
	onBlur: () => void;
	readOnly: boolean;
	properties: PropertyDefinition[];
};

export const IssuePropertiesRow = ({ onBlur, readOnly, properties }: IIssuePropertiesRow) => {
	const getDefaultValue = (name) => properties.find((p) => p.name === name).default;
	return (
		<IssuePropertiesContainer>
			<PropertyColumn>
				<PropertyTitle>
					<FormattedMessage
						id="ticketTopPanel.priority.label"
						defaultMessage="Priority"
					/>
				</PropertyTitle>
				<FormChipSelect
					variant="text"
					tooltip={formatMessage({
						id: 'customTicket.topPanel.priority.tooltip',
						defaultMessage: 'Set priority',
					})}
					name={`properties[${IssueProperties.PRIORITY}]`}
					onBlur={onBlur}
					key={IssueProperties.PRIORITY}
					values={PRIORITY_LEVELS_MAP}
					defaultValue={getDefaultValue(IssueProperties.PRIORITY)}
					disabled={readOnly}
				/>
			</PropertyColumn>
			<ColumnSeparator />
			<PropertyColumn>
				<PropertyTitle>
					<FormattedMessage
						id="ticketTopPanel.dueDate.label"
						defaultMessage="Due"
					/>
				</PropertyTitle>
				<FormDueDateWithIcon
					tooltip={formatMessage({
						id: 'customTicket.topPanel.dueDate.tooltip',
						defaultMessage: 'Set due date',
					})}
					name={`properties[${IssueProperties.DUE_DATE}]`}
					onBlur={onBlur}
					key={IssueProperties.DUE_DATE}
					disabled={readOnly}
				/>
			</PropertyColumn>
			<ColumnSeparator />
			<PropertyColumn>
				<PropertyTitle>
					<FormattedMessage
						id="ticketTopPanel.status.label"
						defaultMessage="Status"
					/>
				</PropertyTitle>
				<FormChipSelect
					variant="text"
					tooltip={formatMessage({
						id: 'customTicket.topPanel.status.tooltip',
						defaultMessage: 'Set status',
					})}
					name={`properties[${IssueProperties.STATUS}]`}
					onBlur={onBlur}
					key={IssueProperties.STATUS}
					values={STATUS_MAP}
					defaultValue={getDefaultValue(IssueProperties.STATUS)}
					disabled={readOnly}
				/>
			</PropertyColumn>
			<FloatRight>
				<InputController
					Input={TicketDetailsAssignees}
					name={`properties[${IssueProperties.ASSIGNEES}]`}
					onBlur={onBlur}
					key={IssueProperties.ASSIGNEES}
					disabled={readOnly}
				/>
			</FloatRight>
		</IssuePropertiesContainer>
	);
};
