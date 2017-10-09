/**
 *  Copyright (C) 2014 3D Repo Ltd
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

var hostname   = "127.0.0.1";
var http_port  = 8080;
var https_port = 443;

module.exports = {
	host: hostname,
	port: 8080,
	cookie: {
		secret: "a",
		parser_secret : "b",
		maxAge: 1000 * 60 * 60
	},
	servers: [
		{
			service: "api",
			subdirectory: "api",
			public_port: http_port,
			public_protocol: "http"
		},
		{
			service: "frontend",
			public_port: http_port,
			http_port: http_port
		},
		{
			service: "chat",
			http_port: 3000,
			https_port: 3000,
			subdirectory: 'chat'
		}
	],
	js_debug_level: 'debug',
	consoleLogging: false,
	logfile: {
		filename: './3drepo.log',
		console_level: 'info',
		file_level: 'debug'
	},
	db: {
		host: 'localhost',
		port: 27017,
		username: 'admintesting',
		password: 'admintesting'
	},
	invoice_dir: '/tmp',
	tokenExpiry: {
		emailVerify: 336,
		forgotPassword: 24
	},
		unitySettings: {
        TOTAL_MEMORY: 2130706432 / 10,
        compatibilitycheck: null,
        backgroundColor: "#222C36",
        splashStyle: "Light",
        dataUrl: "unity/Release/unity.data",
        codeUrl: "unity/Release/unity.js",
        asmUrl: "unity/Release/unity.asm.js",
        memUrl: "unity/Release/unity.mem"
    },
	auth: {
		captcha: false,
		register: true
	},	crossOrigin: true,
	cn_queue: {
		host: 'amqp://localhost:5672',
		worker_queue: 'jobq',
		model_queue: 'modelq',
		callback_queue: 'callbackq',
		upload_dir: '/tmp',
		shared_storage: '/tmp',
		event_exchange: 'eventExchange'
	},
	uploadSizeLimit: 8388608, // 8MB in test enviroment
	test_helper_api: false,
	paypal:{
		validateIPN: false,
		ipnValidateUrl: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
		mode: 'sandbox', //sandbox or live
		//for travis only
		client_id: 'AWog5lbf6LTb07XvRzvl4KAXVrmUyv4rEopFBNxHwO3nNieukILfTSxm8xCdsoAalrWTOPo9oQcrm3R-',
		client_secret: 'EGIwoNlM_vq6rYsmIF2gOGDs0h2uilsiXyKiWjHT3TCqJLrdRHpneFAt5TvVmzjYFvrdZpYF9-zrfNmQ',
		debug:{
			forceExecuteAgreementError: false,
			showFullAgreement: true
		}
	},
	vat: {
		checkUrl: 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl',
		debug: {
			skipChecking: true
		}
	},
	bcf_dir: '/tmp',
	legal: [
		{title: "Terms & Conditions", type: "agreeTo", page: "terms", path: "pug/legal/terms.pug"},
		{title: "Privacy", type: "haveRead", page: "privacy", path: "pug/legal/privacy.pug"},
		{title: "Cookies", type: "haveRead", page: "cookies", path: "pug/legal/cookies.pug"}
	],
	userNotice: false,
	unitySettings: {
        TOTAL_MEMORY: 2130706432 / 10,
        compatibilitycheck: null,
        backgroundColor: "#222C36",
        splashStyle: "Light",
        dataUrl: "unity/Release/unity.data",
        codeUrl: "unity/Release/unity.js",
        asmUrl: "unity/Release/unity.asm.js",
        memUrl: "unity/Release/unity.mem"
    },
}
