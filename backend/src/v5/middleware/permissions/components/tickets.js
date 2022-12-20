const { getUserFromSession } = require('../../../utils/sessions');
const { respond } = require('../../../utils/responder');
const { templates } = require('../../../utils/responseCodes');
const { getCommentById } = require('../../../models/tickets.comments');
const { getTicketById } = require('../../../models/tickets');

const TicketPerms = {};

TicketPerms.canEditComment = async (req, res, next) => {	
	const user = getUserFromSession(req.session);
	const { teamspace, project, model, ticket, comment } = req.params;
	
	try {        
		//ensure ticket exists
		await getTicketById(teamspace, project, model, ticket);
		
        const { author } = await getCommentById(teamspace, project, model, ticket, comment, { _id: 0, author: 1 });

		if (user !== author) {			
			return respond(req, res, templates.notAuthorized);
		}

		await next();
	} catch (err) {
		respond(req, res, err);
	}
};

module.exports = TicketPerms;
