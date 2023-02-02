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
import CommentIcon from '@assets/icons/outlined/comment-outlined.svg';
import SendIcon from '@assets/icons/outlined/send_message-outlined.svg';
import FileIcon from '@assets/icons/outlined/file-outlined.svg';
import { formatMessage } from '@/v5/services/intl';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { CurrentUserHooksSelectors, TicketsCardHooksSelectors, TicketsHooksSelectors } from '@/v5/services/selectorsHooks';
import { TicketsActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { modelIsFederation } from '@/v5/store/tickets/tickets.helpers';
import { ScrollArea } from '@controls/scrollArea';
import { FormattedMessage } from 'react-intl';
import { IComment } from '@/v5/store/tickets/tickets.types';
import DeleteIcon from '@assets/icons/outlined/close-outlined.svg';
import { useEffect, useState } from 'react';
import { ViewerParams } from '../../../routes.constants';
import {
	Accordion,
	Comments,
	Controls,
	CharsCounter,
	FileIconButton,
	SendButton,
	BottomSection,
	MessageInput,
	EmptyCommentsBox,
	DeleteButton,
	CommentReplyContainer,
} from './commentsPanel.styles';
import { Comment } from './comment/comment.component';
import { MAX_MESSAGE_LENGTH, addReply, createMetadata, sanitiseMessage } from './comment/comment.helpers';
import { CommentReply } from './comment/commentReply/commentReply.component';

export const CommentsPanel = () => {
	const [commentReply, setCommentReply] = useState<IComment>(null);
	const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
	const formData = useForm<{ message: string }>({ mode: 'all' });
	const messageInput = formData.watch('message');

	const { teamspace, project, containerOrFederation } = useParams<ViewerParams>();
	const isFederation = modelIsFederation(containerOrFederation);
	const ticketId = TicketsCardHooksSelectors.selectSelectedTicketId();
	const { comments = [], number } = TicketsHooksSelectors.selectTicketById(containerOrFederation, ticketId);

	const currentUser = CurrentUserHooksSelectors.selectCurrentUser();

	const commentReplyLength = commentReply ? addReply(createMetadata(commentReply), '').length : 0;
	const charsCount = (messageInput?.length || 0) + commentReplyLength;
	const charsLimitIsReached = charsCount >= MAX_MESSAGE_LENGTH;
	const commentsListIsEmpty = comments?.length > 0;

	const handleDeleteComment = (commentId) => {
		TicketsActionsDispatchers.deleteTicketComment(
			teamspace,
			project,
			containerOrFederation,
			ticketId,
			isFederation,
			commentId,
		);
	};

	const handleReplyToComment = (commentId) => {
		const comment = comments.find(({ _id }) => _id === commentId);
		setCommentReply(comment);
	};

	const handleEditComment = (commentId, message: string) => {
		const oldComment = comments.find(({ _id }) => _id === commentId);
		const newHistory = (oldComment.history || []).concat({
			message: oldComment.message,
			images: oldComment.images,
			timestamp: new Date(),
		});
		TicketsActionsDispatchers.updateTicketComment(
			teamspace,
			project,
			containerOrFederation,
			ticketId,
			isFederation,
			commentId,
			{ history: newHistory, message },
		);
	};

	const createComment = async () => {
		setIsSubmittingMessage(true);
		let message = sanitiseMessage(messageInput);
		if (commentReply) {
			message = addReply(createMetadata(commentReply), message);
		}
		const newComment = {
			author: currentUser.username,
			message,
		};
		TicketsActionsDispatchers.createTicketComment(
			teamspace,
			project,
			containerOrFederation,
			ticketId,
			isFederation,
			newComment,
			() => {
				setCommentReply(null);
				formData.reset();
				setIsSubmittingMessage(false);
			},
			() => { setIsSubmittingMessage(false); },
		);
	};

	useEffect(() => {
		if (!number) return;
		TicketsActionsDispatchers.fetchTicketComments(
			teamspace,
			project,
			containerOrFederation,
			ticketId,
			isFederation,
		);
	}, [number]);

	return (
		<Accordion
			title={formatMessage({ id: 'customTicket.panel.comments', defaultMessage: 'Comments' })}
			Icon={CommentIcon}
		>
			<FormProvider {...formData}>
				<ScrollArea autoHeight autoHeightMin={400} autoHeightMax={400}>
					{commentsListIsEmpty && (
						<Comments>
							{comments.map((comment) => (
								<Comment
									{...comment}
									key={comment._id}
									onDelete={handleDeleteComment}
									onReply={handleReplyToComment}
									onEdit={handleEditComment}
								/>
							))}
						</Comments>
					)}
					{!commentsListIsEmpty && (
						<EmptyCommentsBox>
							<FormattedMessage id="ticket.comments.empty" defaultMessage="No comments" />
						</EmptyCommentsBox>
					)}
				</ScrollArea>
				<BottomSection>
					{commentReply && (
						<CommentReplyContainer>
							<CommentReply {...createMetadata(commentReply)} shortMessage />
							<DeleteButton onClick={() => setCommentReply(null)}>
								<DeleteIcon />
							</DeleteButton>
						</CommentReplyContainer>
					)}
					<MessageInput
						name="message"
						placeholder={formatMessage({
							id: 'customTicket.panel.comments.leaveAComment',
							defaultMessage: 'Leave a comment',
						})}
						inputProps={{
							maxLength: Math.max(MAX_MESSAGE_LENGTH - commentReplyLength, 0),
						}}
					/>
					<Controls>
						<FileIconButton>
							<FileIcon />
						</FileIconButton>
						<CharsCounter $error={charsLimitIsReached}>{charsCount}/{MAX_MESSAGE_LENGTH}</CharsCounter>
						<SendButton
							disabled={!messageInput?.trim()?.length || charsLimitIsReached}
							onClick={createComment}
							isPending={isSubmittingMessage}
						>
							<SendIcon />
						</SendButton>
					</Controls>
				</BottomSection>
			</FormProvider>
		</Accordion>
	);
};
