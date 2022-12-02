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
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { TextField } from '@controls/inputs/textField/textField.component';
import { PasswordField } from '@controls/inputs/passwordField/passwordField.component';
import UserIcon from '@assets/icons/outlined/user-outlined.svg';
import EmailIcon from '@assets/icons/outlined/email-outlined.svg';
import PasswordIcon from '@assets/icons/outlined/lock-outlined.svg';
import { ControlledInput } from '@controls/inputs/controlledInput.component';
import { UserSignupSchemaAccount } from '@/v5/validation/userSchemes/userSignupSchemes';
import { isEqual, pick, defaults } from 'lodash';
import { NextStepButton } from '../userSignupFormStep.styles';
import { IconContainer } from './userSignupFormStepAccount.styles';

export interface IAccountFormInput {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

type UserSignupFormStepAccountProps = {
	updateFields: (fields: any) => void;
	onSubmitStep: () => void;
	onComplete: () => void;
	onUncomplete: () => void;
	fields: IAccountFormInput;
	alreadyExistingUsernames: string[];
	alreadyExistingEmails: string[];
};

export const UserSignupFormStepAccount = ({
	updateFields,
	onSubmitStep,
	onComplete,
	onUncomplete,
	fields,
	alreadyExistingUsernames,
	alreadyExistingEmails,
}: UserSignupFormStepAccountProps) => {
	const DEFAULT_FIELDS: IAccountFormInput = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	};

	const getAccountFields = (): IAccountFormInput => defaults(
		pick(fields, ['username', 'email', 'password', 'confirmPassword']),
		DEFAULT_FIELDS,
	);

	const {
		watch,
		getValues,
		trigger,
		control,
		formState,
		formState: { errors, isValid: formIsValid, dirtyFields },
	} = useForm<IAccountFormInput>({
		mode: 'all',
		reValidateMode: 'onChange',
		resolver: yupResolver(UserSignupSchemaAccount),
		context: { alreadyExistingUsernames, alreadyExistingEmails },
		defaultValues: getAccountFields(),
	});

	const password = watch('password');

	useEffect(() => {
		if (dirtyFields.password && dirtyFields.confirmPassword) {
			trigger('confirmPassword');
		}
	}, [password]);

	useEffect(() => {
		if (formIsValid) {
			onComplete();
		} else {
			onUncomplete();
			if (alreadyExistingUsernames.length) trigger('username');
			if (alreadyExistingEmails.length) trigger('email');
		}
	}, [formIsValid]);

	useEffect(() => {
		const newFields = getValues();
		if (!isEqual(newFields, getAccountFields())) {
			updateFields(newFields);
		}
	}, [formState]);

	return (
		<>
			<ControlledInput
				Input={(inputProps) => (
					<TextField
						{...inputProps}
						InputProps={{
							startAdornment: (
								<IconContainer>
									<UserIcon />
								</IconContainer>
							),
						}}
					/>
				)}
				name="username"
				control={control}
				label={formatMessage({
					id: 'userSignup.form.username',
					defaultMessage: 'Username',
				})}
				required
				formError={errors.username}
			/>
			<ControlledInput
				Input={(inputProps) => (
					<TextField
						{...inputProps}
						InputProps={{
							startAdornment: (
								<IconContainer>
									<EmailIcon />
								</IconContainer>
							),
						}}
					/>
				)}
				name="email"
				control={control}
				label={formatMessage({
					id: 'userSignup.form.email',
					defaultMessage: 'Email',
				})}
				required
				formError={errors.email}
			/>
			<ControlledInput
				Input={(inputProps) => (
					<PasswordField
						{...inputProps}
						InputProps={{
							startAdornment: (
								<IconContainer>
									<PasswordIcon />
								</IconContainer>
							),
						}}
					/>
				)}
				name="password"
				control={control}
				label={formatMessage({
					id: 'userSignup.form.password',
					defaultMessage: 'Password',
				})}
				required
				formError={errors.password}
			/>
			<ControlledInput
				Input={(inputProps) => (
					<PasswordField
						{...inputProps}
						InputProps={{
							startAdornment: (
								<IconContainer>
									<PasswordIcon />
								</IconContainer>
							),
						}}
					/>
				)}
				name="confirmPassword"
				control={control}
				label={formatMessage({
					id: 'userSignup.form.confirmPassword',
					defaultMessage: 'Confirm password',
				})}
				required
				disabled={!password}
				formError={errors.confirmPassword}
			/>
			<NextStepButton
				disabled={!formIsValid}
				onClick={onSubmitStep}
			>
				<FormattedMessage
					id="userSignup.form.button.next"
					defaultMessage="Next step"
				/>
			</NextStepButton>
		</>
	);
};
