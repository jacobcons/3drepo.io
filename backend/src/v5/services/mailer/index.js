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

const baseTemplate = require('./templates/baseTemplate');
const config = require('../../utils/config');
const { createTestAccount } = require('nodemailer');
const { templates: emailTemplates } = require('./mailer.constants');
const { logger } = require('../../utils/logger');
const nodemailer = require('nodemailer');
const { templates } = require('../../utils/responseCodes');

const Mailer = {};

let transporter;

let prom;

const initConfig = async () => {
	if (!config?.mail?.sender) {
		throw new Error('config.mail.sender is not set');
	}

	if (config.mail?.generateCredentials) {
		const { user, pass } = await createTestAccount();

		config.mail.smtpConfig = {
			host: 'smtp.ethereal.email',
			port: 587,
			auth: { user, pass },
		};

		transporter = nodemailer.createTransport(config.mail.smtpConfig);
	}

	if (!config.mail?.smtpConfig) {
		throw new Error('config.mail.smtpConfig is not set');
	}
};

const checkMailerConfig = async () => {
	if (!prom) prom = initConfig();
	await prom;
};

checkMailerConfig().catch(
	// istanbul ignore next
	(err) => {
		logger.logError(`Failed to initialise mailer: ${err.message}`);
		// eslint-disable-next-line no-process-exit
		process.exit(1);
	},
);

Mailer.sendEmail = async (templateName, to, data, attachments) => {
	const template = emailTemplates[templateName];

	if (!template) {
		logger.logError(`Mailer error - Unrecognised email template ${templateName}`);
		throw templates.unknown;
	}

	try {
		await checkMailerConfig();
		const emailContent = template.html(data);
		const mailOptions = {
			from: config.mail.sender,
			to,
			subject: template.subject(data),
			html: baseTemplate.html({ ...data, emailContent }),
		};

		if (attachments) {
			mailOptions.attachments = attachments;
		}
		await transporter.sendMail(mailOptions);
	} catch (err) {
		logger.logError(`Email error - ${err.message}`);
		throw err;
	}
};

Mailer.reset = () => {
	prom = undefined;
};

module.exports = Mailer;
