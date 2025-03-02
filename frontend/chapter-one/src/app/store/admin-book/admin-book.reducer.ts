import { createReducer, on } from '@ngrx/store';
import * as AdminBookActions from './admin-book.actions';
import {  initialAdminBookState } from './admin-book.state';

export const adminBookReducer = createReducer(
  initialAdminBookState,
  on(AdminBookActions.loadAdminBooks, (state, { page, limit }) => ({
    ...state,
    loading: true,
    error: null,
    pagination: {
      ...state.pagination,
      page: page || state.pagination.page,
      limit: limit || state.pagination.limit
    }
  })),
  on(AdminBookActions.loadAdminBooksSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    books: response.data,
    pagination: {
      page: response.page,
      limit: response.limit,
      total: response.total,
      pages: response.pages,
      hasNextPage: response.hasNextPage,
      hasPreviousPage: response.hasPreviousPage,
    }
  })),
  on(AdminBookActions.loadAdminBooksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AdminBookActions.changeAdminBookPage, (state, { page, limit }) => ({
    ...state,
    pagination: { ...state.pagination, page, limit }
  })),
  on(AdminBookActions.loadAdminBookDetailsSuccess, (state, { book }) => ({
    ...state,
    selectedBook: book
  })),
  on(AdminBookActions.updateAdminBookSuccess, (state, { book }) => ({
    ...state,
    books: state.books.map(b => b.id === book.id ? book : b),
    selectedBook: book,
  })),
  on(AdminBookActions.deleteAdminBookSuccess, (state) => ({
    ...state,
    pagination: { ...state.pagination, page: 1 },
    selectedBook: null,
  }))
);
