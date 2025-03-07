import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PublicBookState } from './public-book.state';

export const selectPublicBooksState = createFeatureSelector<PublicBookState>('publicBooks');

export const selectAllPublicBooks = createSelector(
  selectPublicBooksState,
  state => state.books
);

export const selectPublicBooksLoading = createSelector(
  selectPublicBooksState,
  state => state.loading
);

export const selectPublicBooksPagination = createSelector(
  selectPublicBooksState,
  state => state.pagination
);

export const selectPublicBookFilters = createSelector(
  selectPublicBooksState,
  state => state.filters
);

export const selectPublicSelectedBook = createSelector(
  selectPublicBooksState,
  state => state.selectedBook
);
