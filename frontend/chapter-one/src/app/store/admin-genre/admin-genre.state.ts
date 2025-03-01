import { Genre } from '../../core/models/genre.model';
import { Pagination } from '../../core/models/pagination.model';

export interface AdminGenreState {
  genres: Genre[];
  selectedGenre: Genre | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

export const initialAdminGenreState: AdminGenreState = {
  genres: [],
  selectedGenre: null,
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
