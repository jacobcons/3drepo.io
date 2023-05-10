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

const { v5Path } = require('../../../interop');

const { logger } = require(`${v5Path}/utils/logger`);
const { getCollectionsEndsWith, parsePath } = require('../../utils');

const { find, listDatabases } = require(`${v5Path}/handler/db`);

const Path = require('path');
const FS = require('fs');

const DEFAULT_OUT_FILE = 'links.csv';

const ENTRIES_TO_PROCESS = 50000;

const determineDBList = async (toInclude, toExclude) => {
	if (toInclude?.length && toExclude?.length) {
		throw new Error('Cannot specify both databases to include and exclude.');
	}

	if (toInclude) {
		return toInclude.split(',');
	}

	const dbsToExclude = toExclude ? toExclude.split(',') : [];

	const dbList = await listDatabases();

	return dbList.flatMap(({ name }) => (dbsToExclude.includes(name) ? [] : name));
};

const determineColList = async (dbName, toInclude, toExclude) => {
	if (toInclude?.length && toExclude?.length) {
		throw new Error('Cannot specify both collections to include and exclude.');
	}

	if (toInclude) {
		const cols = await Promise.all(toInclude.split(',').map((ext) => getCollectionsEndsWith(dbName, ext)));
		return cols.flat();
	}

	const colsToExclude = toExclude ? toExclude.split(',') : [];
	const collections = await getCollectionsEndsWith(dbName, '.ref');
	return collections.filter(({ name }) => !colsToExclude.includes(name));
};

const run = async (includeDB, excludeDB, includeCol, excludeCol, outFile = DEFAULT_OUT_FILE) => {
	const dbList = await determineDBList(includeDB, excludeDB);

	logger.logInfo(`Dump out a list of links and their file size on ${dbList.length} teamspaces`);

	const writeStream = FS.createWriteStream(parsePath(outFile));

	for (const dbName of dbList) {
		logger.logInfo(`-${dbName}`);
		// eslint-disable-next-line no-await-in-loop
		const collections = await determineColList(dbName, includeCol, excludeCol);

		for (const { name: colName } of collections) {
			logger.logInfo(`\t-${colName}`);

			let lastId;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const query = lastId ? { type: 'fs', _id: { $gt: lastId } } : { type: 'fs' };
				// eslint-disable-next-line no-await-in-loop
				const res = await find(dbName, colName, query,
					{ link: 1, size: 1 }, { _id: 1 }, ENTRIES_TO_PROCESS);
				if (!res.length) break;
				res.forEach(({ link, size }) => {
					writeStream.write(`${link},${size}\n`);
				});
				lastId = res[res.length - 1]._id;
			}
			// }
		}
	}
	writeStream.end();
};

const genYargs =/* istanbul ignore next */ (yargs) => {
	const commandName = Path.basename(__filename, Path.extname(__filename));
	const argsSpec = (subYargs) => subYargs.option('includeDB', {
		describe: 'list of databases extensions to include (comma separated)',
		type: 'string',
	}).option('excludeDB', {
		describe: 'list of databases extensions to exclude (comma separated)',
		type: 'string',
	}).option('includeCol', {
		describe: 'list of collection extensions to include (comma separated)',
		type: 'string',
	}).option('excludeCol', {
		describe: 'list of collection extensions to exclude (comma separated)',
		type: 'string',
	})
		.option('outFile', {
			describe: 'Name of output file',
			type: 'string',
			default: DEFAULT_OUT_FILE,
		});
	return yargs.command(
		commandName,
		'Get all ref links from database and output to console',
		argsSpec,
		({ includeDB, excludeDB, includeCol, excludeCol, outFile }) => run(
			includeDB, excludeDB, includeCol, excludeCol, outFile),
	);
};

module.exports = {
	run,
	genYargs,
};
