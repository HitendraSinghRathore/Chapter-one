import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminGenreState } from './admin-genre.state';

export const selectAdminGenreState = createFeatureSelector<AdminGenreState>('adminGenre');

export const selectAllAdminGenres = createSelector(
  selectAdminGenreState,
  state => state.genres
);

export const selectAdminGenreLoading = createSelector(
  selectAdminGenreState,
  state => state.loading
);

export const selectAdminGenrePagination = createSelector(
  selectAdminGenreState,
  state => state.pagination
);

export const selectAdminSelectedGenre = createSelector(
  selectAdminGenreState,
  state => state.selectedGenre
);
