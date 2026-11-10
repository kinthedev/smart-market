export interface ReviewUser {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
  images?: { url: string }[];
}

export interface Review {
  id: string;
  rating: number;
  content: string | null;
  verifiedPurchase: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  product?: ReviewProduct;
}

export interface ReviewStats {
  totalAll: number;
  avgRating: number;
  hiddenCount: number;
}

export interface ReviewSummary {
  ratingAvg: number;
  reviewCount: number;
  commentCount: number;
  histogram: Record<string, number>;
  purchased: boolean;
  canReview: boolean;
  myReview: Review | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReviewListResponse {
  items: Review[];
  pagination: Pagination;
  stats?: ReviewStats;
}
