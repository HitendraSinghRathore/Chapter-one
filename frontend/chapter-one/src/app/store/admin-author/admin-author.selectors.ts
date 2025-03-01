import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminAuthorState } from './admin-author.state';

export const selectAdminAuthorState = createFeatureSelector<AdminAuthorState>('adminAuthor');

export const selectAllAdminAuthors = createSelector(
  selectAdminAuthorState,
  state => state.authors
);

export const selectAdminAuthorLoading = createSelector(
  selectAdminAuthorState,
  state => state.loading
);

export const selectAdminAuthorPagination = createSelector(
  selectAdminAuthorState,
  state => state.pagination
);

export const selectAdminSelectedAuthor = createSelector(
  selectAdminAuthorState,
  state => state.selectedAuthor
);
