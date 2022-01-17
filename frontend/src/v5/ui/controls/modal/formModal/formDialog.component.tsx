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

import { Button, Dialog } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@assets/icons/close.svg';
import { Form, Title, Header, CloseButton, FormDialogContent, FormDialogActions, RemoveWhiteCorners, Subtitle } from './formDialog.styles';

interface IFormDialog extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	onClickClose?: () => void;
	title: string;
	subtitle?: string;
	open?: boolean;
	confirmLabel?: string;
	maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	isValid?: boolean;
}

export const FormModal = ({
	onClickClose,
	title,
	subtitle,
	confirmLabel,
	open,
	children,
	className,
	maxWidth = 'xl',
	isValid = true,
	...formProps
}: IFormDialog) => (
	<Dialog
		open={open}
		onClose={onClickClose}
		className={className}
		maxWidth={maxWidth}
		PaperComponent={RemoveWhiteCorners}
		fullWidth
	>
		<Form {...formProps}>
			<Header>
				<div>
					<Title>
						{title}
					</Title>
					{subtitle && <Subtitle>{subtitle}</Subtitle>}
				</div>

				<CloseButton aria-label="Close dialog" onClick={onClickClose}>
					<CloseIcon />
				</CloseButton>
			</Header>
			<FormDialogContent>
				{children}
			</FormDialogContent>
			<FormDialogActions>
				<Button autoFocus onClick={onClickClose} variant="outlined" color="secondary" size="medium">
					Cancel
				</Button>
				<Button disabled={!isValid} type="submit" variant="contained" color="primary" size="medium">
					{confirmLabel || 'OK'}
				</Button>
			</FormDialogActions>
		</Form>
	</Dialog>
);
