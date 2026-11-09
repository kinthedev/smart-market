export interface CreateReviewInput {
	rating: number
	content?: string | null
}

export interface ReviewQueryFilter {
	page?: number | string
	limit?: number | string
	rating?: number | string
}

export interface AdminReviewQueryFilter extends ReviewQueryFilter {
	search?: string
	isHidden?: string
}
