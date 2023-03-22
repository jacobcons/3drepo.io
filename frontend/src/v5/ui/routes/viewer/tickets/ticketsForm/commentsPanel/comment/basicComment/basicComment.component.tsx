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

import { TicketCommentHistoryBlock, TicketCommentReplyMetadata } from '@/v5/store/tickets/comments/ticketComments.types';
import { editedCommentMessage } from '@/v5/store/tickets/comments/ticketComments.helpers';
import { DialogsActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { getImgSrc } from '@/v5/store/tickets/tickets.helpers';
import { CommentImages } from '../commentImages/commentImages.component';
import { CommentMarkDown } from '../commentMarkDown/commentMarkDown.component';
import { CommentContainer, CommentAge, CommentAuthor, EditedCommentLabel, SingleImage, CommentImagesContainer } from './basicComment.styles';
import { CommentReply } from '../commentReply/commentReply.component';

export type BasicCommentProps = {
	images?: string[];
	children?: any;
	className?: string;
	message?: string;
	commentAge: string;
	history?: TicketCommentHistoryBlock[];
	metadata?: TicketCommentReplyMetadata;
	isCurrentUserComment?: boolean;
	author?: string;
};
export const BasicComment = ({
	author,
	images = [],
	children,
	message,
	commentAge,
	history,
	metadata,
	isCurrentUserComment = true,
	...props
}: BasicCommentProps) => {
	const imagesSrc = images.map(getImgSrc);
	return (
		<CommentContainer {...props}>
			{images.length === 1 && (
				<SingleImage
					src={imagesSrc[0]}
					onClick={() => DialogsActionsDispatchers.open('images', { images: imagesSrc })}
				/>
			)}
			{author && (<CommentAuthor>{author}</CommentAuthor>)}
			{metadata && (
				<CommentReply
					isCurrentUserComment={isCurrentUserComment}
					variant={isCurrentUserComment ? 'secondary' : 'primary'}
					{...metadata}
				/>
			)}
			{images.length > 1 && (
				<CommentImagesContainer>
					<CommentImages images={imagesSrc} />
				</CommentImagesContainer>
			)}
			{history?.length && <EditedCommentLabel>{editedCommentMessage}</EditedCommentLabel>}
			{message && (<CommentMarkDown>{message}</CommentMarkDown>)}
			<CommentAge>{commentAge}</CommentAge>
		</CommentContainer>
	);
};
