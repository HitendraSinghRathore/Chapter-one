import { createReducer, on } from '@ngrx/store';
import * as PublicBookActions from './public-book.action';
import { initialPublicBookState } from './public-book.state';

export const publicBooksReducer = createReducer(
  initialPublicBookState,
  on(PublicBookActions.loadPublicBooks, (state, { page, limit, filters }) => ({
    ...state,
    loading: true,
    error: null,
    filters: filters ? { ...state.filters, ...filters } : state.filters,
    pagination: {
      ...state.pagination,
      page: page || state.pagination.page,
      limit: limit || state.pagination.limit
    }
  })),
  on(PublicBookActions.loadPublicBooksSuccess, (state, { response }) => ({
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
  on(PublicBookActions.loadPublicBooksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(PublicBookActions.updatePublicBookFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, page: 1 }  
  })),
  on(PublicBookActions.changePublicBookPage, (state, { page, limit }) => ({
    ...state,
    pagination: { ...state.pagination, page, limit }
  })),
  on(PublicBookActions.loadPublicBookDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedBook: null
  })),
  on(PublicBookActions.loadPublicBookDetailsSuccess, (state, { book }) => ({
    ...state,
    loading: false,
    error: null,
    selectedBook: book
  })),
  on(PublicBookActions.loadPublicBookDetailsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
