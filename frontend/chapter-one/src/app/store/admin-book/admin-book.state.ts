import { Book, BookListItem } from '../../core/models/book.model';
import { Pagination } from '../../core/models/pagination.model';

export interface AdminBookState {
  books: BookListItem[];
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

export const initialAdminBookState: AdminBookState = {
  books: [],
  selectedBook: null,
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
