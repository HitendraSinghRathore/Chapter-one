import { createReducer, on } from '@ngrx/store';
import * as AdminGenreActions from './admin-genre.actions';
import {  initialAdminGenreState } from './admin-genre.state';

export const adminGenreReducer = createReducer(
  initialAdminGenreState,
  on(AdminGenreActions.loadAdminGenres, (state, { page, limit }) => ({
    ...state,
    loading: true,
    error: null,
    pagination: {
      ...state.pagination,
      page: page || state.pagination.page,
      limit: limit || state.pagination.limit
    }
  })),
  on(AdminGenreActions.loadAdminGenresSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    genres: response.data,
    pagination: {
      page: response.page,
      limit: response.limit,
      total: response.total,
      pages: response.pages,
      hasNextPage: response.hasNextPage,
      hasPreviousPage: response.hasPreviousPage,
    }
  })),
  on(AdminGenreActions.loadAdminGenresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AdminGenreActions.changeAdminGenrePage, (state, { page }) => ({
    ...state,
    pagination: { ...state.pagination, page }
  })),
  on(AdminGenreActions.loadAdminGenreDetailsSuccess, (state, { genre }) => ({
    ...state,
    selectedGenre: genre
  })),
  on(AdminGenreActions.updateAdminGenreSuccess, (state, { genre }) => ({
    ...state,
    genres: state.genres.map(g => g.id === genre.id ? genre : g),
    selectedGenre: genre
  })),
  on(AdminGenreActions.deleteAdminGenreSuccess, (state) => ({
    ...state,
    pagination: { ...state.pagination, page: 1 },
    selectedGenre: null
  }))
);
