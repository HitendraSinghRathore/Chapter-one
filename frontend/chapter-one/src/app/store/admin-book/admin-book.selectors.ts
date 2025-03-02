import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminBookState } from './admin-book.state';

export const selectAdminBookState = createFeatureSelector<AdminBookState>('adminBook');

export const selectAllAdminBooks = createSelector(
  selectAdminBookState,
  state => state.books
);

export const selectAdminBookLoading = createSelector(
  selectAdminBookState,
  state => state.loading
);

export const selectAdminBookPagination = createSelector(
  selectAdminBookState,
  state => state.pagination
);

export const selectAdminSelectedBook = createSelector(
  selectAdminBookState,
  state => state.selectedBook
);
