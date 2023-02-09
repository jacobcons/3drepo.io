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

import { CurrentUserHooksSelectors, TeamspacesHooksSelectors, UsersHooksSelectors } from '@/v5/services/selectorsHooks';
import { getImgSrc } from '@/v5/store/tickets/tickets.helpers';
import { TicketCommentReplyMetadata } from '@/v5/store/tickets/comments/ticketComments.types';
import { CommentAuthor } from '../basicCommentWithImages/basicCommentWithImages.styles';
import { CommentMarkDown, CommentReplyContainer, ExpandableImage, OriginalMessage } from './commentReply.styles';

type CommentReplyProps = TicketCommentReplyMetadata & {
	variant?: 'primary' | 'secondary',
	isCurrentUserComment?: boolean,
	shortMessage?: boolean,
	images?: string[],
};
export const CommentReply = ({
	message,
	author,
	variant = 'primary',
	isCurrentUserComment = true,
	images = [],
	...props
}: CommentReplyProps) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const currentUser = CurrentUserHooksSelectors.selectUsername();
	const user = UsersHooksSelectors.selectUser(teamspace, author);

	const authorDisplayName = (isCurrentUserComment && author === currentUser) ? '' : `${user.firstName} ${user.lastName}`;

	return (
		<CommentReplyContainer variant={variant} {...props}>
			<div>
				{authorDisplayName && (<CommentAuthor>{authorDisplayName}</CommentAuthor>)}
				<OriginalMessage>
					<CommentMarkDown>
						{images.length && <span>icon</span>}
						{message}
					</CommentMarkDown>
				</OriginalMessage>
			</div>
			{images.length && (<ExpandableImage images={images.map(getImgSrc)} showExtraImagesValue />)}
		</CommentReplyContainer>
	);
};
