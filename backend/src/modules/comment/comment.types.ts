export interface CreateCommentInput {
	content: string
}

export interface CommentQueryFilter {
	page?: number | string
	limit?: number | string
}

export interface AdminCommentQueryFilter extends CommentQueryFilter {
	search?: string
	isHidden?: string
}
