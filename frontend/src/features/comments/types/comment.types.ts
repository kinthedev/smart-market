export interface CommentUser {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CommentListResponse {
  items: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
