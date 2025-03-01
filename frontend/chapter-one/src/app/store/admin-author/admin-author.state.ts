import { Author } from '../../core/models/author.model';
import { Pagination } from '../../core/models/pagination.model';

export interface AdminAuthorState {
  authors: Author[];
  selectedAuthor: Author | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

export const initialAdminAuthorState: AdminAuthorState = {
  authors: [],
  selectedAuthor: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  }
};
