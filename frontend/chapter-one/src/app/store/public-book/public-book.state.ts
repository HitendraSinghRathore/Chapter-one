import { BookListItem, Book, BookFilter } from '../../core/models/book.model';
import { Pagination } from '../../core/models/pagination.model';


export interface PublicBookState {
  books: BookListItem[];
  selectedBook: Book | null;
  filters: BookFilter;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

export const initialPublicBookState: PublicBookState = {
  books: [],
  selectedBook: null,
  filters: {},
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};
