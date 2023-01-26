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

import { TeamspacesHooksSelectors, UsersHooksSelectors } from '@/v5/services/selectorsHooks';
import { getMemberImgSrc, USER_NOT_FOUND } from '@/v5/store/users/users.helpers';
import { UserPopover } from '@components/shared/userPopover/userPopover.component';
import { UserCircle } from '@controls/assignees/assignees.styles';
import ReplyIcon from '@assets/icons/outlined/reply_arrow-outlined.svg';
import { PrimaryCommentButton } from '../commentButton/commentButton.styles';
import { CommentReplyMetadata } from '@/v5/store/tickets/tickets.types';
import { CommentReply } from '../commentReply/commentReply.component';
import { CommentMarkDown } from '../commentMarkDown/commentMarkDown';
import { deletedCommentText, deletedOtherUserCommentTime } from '../comment.helpers';
import { CommentAuthor, CommentButtons, CommentTime } from '../comment.styles';
import { CommentProps } from '../comment.component';
import { HoverPopover, CommentContainer } from './otherUserComment.styles';

type UserCommentProps = Omit<CommentProps, 'createdAt'> & {
	commentAge: string;
	metadata?: CommentReplyMetadata;
};
const OtherUserCommentPopoverWrapper = ({ deleted = false, user, children }) => (
	<CommentContainer $deleted={deleted} data-author={user.user}>
		<HoverPopover anchor={(props) => <UserCircle user={user} {...props} />}>
			<UserPopover user={user} />
		</HoverPopover>
		{children}
	</CommentContainer>
);

export const OtherUserComment = ({ _id, deleted, comment, commentAge, author, onReply, metadata }: UserCommentProps) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	let user = UsersHooksSelectors.selectUser(teamspace, author);
	if (user) {
		user = { ...user, avatarUrl: getMemberImgSrc(teamspace, user.user), hasAvatar: true };
	} else {
		user = USER_NOT_FOUND;
	}
	if (deleted) {
		return (
			<OtherUserCommentPopoverWrapper deleted user={user}>
				<CommentAuthor>{author}</CommentAuthor>
				<CommentMarkDown>{deletedCommentText}</CommentMarkDown>
				<CommentTime>{deletedOtherUserCommentTime(user.firstName)}</CommentTime>
			</OtherUserCommentPopoverWrapper>
		);
	}

	return (
		<OtherUserCommentPopoverWrapper user={user}>
			<CommentButtons>
				<PrimaryCommentButton onClick={() => onReply(_id)}>
					<ReplyIcon />
				</PrimaryCommentButton>
			</CommentButtons>
			<CommentAuthor>{author}</CommentAuthor>
			{metadata.comment && (<CommentReply isCurrentUserComment={false} {...metadata} />)}
			<CommentMarkDown>{comment}</CommentMarkDown>
			<CommentTime>{commentAge}</CommentTime>
		</OtherUserCommentPopoverWrapper>
	);
};
