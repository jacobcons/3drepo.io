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
import { UserPopover } from '@components/shared/userPopover/userPopover.component';
import ReplyIcon from '@assets/icons/outlined/reply_arrow-outlined.svg';
import { CommentReplyMetadata, IComment } from '@/v5/store/tickets/tickets.types';
import { UserCircle } from '@controls/assignees/assigneesList/assigneeListItem/assigneeListItem.styles';
import { PrimaryCommentButton } from '../commentButton/commentButton.styles';
import { CommentReply } from '../commentReply/commentReply.component';
import { CommentMarkDown } from '../commentMarkDown/commentMarkDown';
import { editedCommentMessage } from '../comment.helpers';
import { CommentAuthor, CommentButtons, CommentAge, EditedCommentLabel } from '../comment.styles';
import { HoverPopover, CommentContainer } from './otherUserComment.styles';
import { DeletedComment } from './deletedComment/deletedComment.component';

type OtherUserCommentProps = Omit<IComment, 'updatedAt'> & {
	commentAge: string;
	metadata?: CommentReplyMetadata;
	onReply: (commentId) => void;
};
const OtherUserCommentPopoverWrapper = ({ user, children }) => (
	<CommentContainer data-author={user.user}>
		<HoverPopover anchor={(props) => <UserCircle user={user} {...props} />}>
			<UserPopover user={user} />
		</HoverPopover>
		{children}
	</CommentContainer>
);

export const OtherUserComment = ({
	_id,
	deleted,
	message,
	commentAge,
	author,
	history,
	onReply,
	metadata,
}: OtherUserCommentProps) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const user = UsersHooksSelectors.selectUser(teamspace, author);
	const authorDisplayName = `${user.firstName} ${user.lastName}`;

	return (
		<OtherUserCommentPopoverWrapper user={user}>
			{deleted
				? (<DeletedComment user={user} authorDisplayName={authorDisplayName} />)
				: (
					<>
						<CommentButtons>
							<PrimaryCommentButton onClick={() => onReply(_id)}>
								<ReplyIcon />
							</PrimaryCommentButton>
						</CommentButtons>
						<CommentAuthor>{authorDisplayName}</CommentAuthor>
						{metadata.message && (<CommentReply isCurrentUserComment={false} {...metadata} />)}
						{history && <EditedCommentLabel>{editedCommentMessage}</EditedCommentLabel>}
						<CommentMarkDown>{message}</CommentMarkDown>
						<CommentAge>{commentAge}</CommentAge>
					</>
				)}
		</OtherUserCommentPopoverWrapper>
	);
};
