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

const db = require('../handler/db');
const { templates } = require('../utils/responseCodes');

const Metadata = {};

const collectionName = (model) => `${model}.scene`;

Metadata.getMetadataByQuery = async (teamspace, model, query, projection) => {
	const metadata = await db.findOne(teamspace, collectionName(model), query, projection);

	if (!metadata) {
		throw templates.metadataNotFound;
	}

	return metadata;
};

Metadata.updateCustomMetadata = async (teamspace, model, metadataId, changeSet) => {
	const { metadata } = await Metadata.getMetadataByQuery(teamspace, model, { _id: metadataId }, { metadata: 1 });
	const metadataKeyLookup = metadata.reduce((a, b) => ({ ...a, [b.key]: 1 }), {});

	changeSet.forEach((um) => {
		const metadataExists = metadataKeyLookup[um.key];
		if (metadataExists) {
			const existingMetadata = metadata.find((m) => m.key === um.key);
			if (um.value) {
				existingMetadata.value = um.value;
			} else {
				const index = metadata.indexOf(existingMetadata);
				metadata.splice(index, 1);
			}
		} else if (um.value) {
			metadata.push({ ...um, custom: true });
		}
	});

	await db.updateOne(teamspace, collectionName(model), { _id: metadataId }, { $set: { metadata } });
};

module.exports = Metadata;
