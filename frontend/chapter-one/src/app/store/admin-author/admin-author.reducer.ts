import { createReducer, on } from '@ngrx/store';
import * as AdminAuthorActions from './admin-author.actions';
import { initialAdminAuthorState } from './admin-author.state';

export const adminAuthorReducer = createReducer(
  initialAdminAuthorState,
  on(AdminAuthorActions.loadAdminAuthors, (state, { page, limit }) => ({
    ...state,
    loading: true,
    error: null,
    pagination: {
      ...state.pagination,
      page: page || state.pagination.page,
      limit: limit || state.pagination.limit,
    },
  })),
  on(AdminAuthorActions.loadAdminAuthorsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    authors: response.data,
    pagination: {
      page: response.page,
      limit: response.limit,
      total: response.total,
      pages: response.pages,
      hasNextPage: response.hasNextPage,
      hasPreviousPage: response.hasPreviousPage,
    },
  })),
  on(AdminAuthorActions.loadAdminAuthorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AdminAuthorActions.changeAdminAuthorPage, (state, { page }) => ({
    ...state,
    pagination: { ...state.pagination, page }
  })),
  on(AdminAuthorActions.loadAdminAuthorDetailsSuccess, (state, { author }) => ({
    ...state,
    selectedAuthor: author
  })),
  on(AdminAuthorActions.updateAdminAuthorSuccess, (state, { author }) => ({
    ...state,
    authors: state.authors.map(a => a.id === author.id ? author : a),
    selectedAuthor: author,
  })),
  on(AdminAuthorActions.deleteAdminAuthorSuccess, (state) => ({
    ...state,
    pagination: { ...state.pagination, page: 1 },
    selectedAuthor: null,
  }))
);
