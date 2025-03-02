/* eslint-disable no-undef */
import { createAction, props } from '@ngrx/store';
import { Book } from '../../core/models/book.model';
import { BookResponse } from '../../core/services/book.service';

export const loadAdminBooks = createAction(
  '[Admin Book] Load Books',
  props<{ page?: number; limit?: number }>()
);

export const loadAdminBooksSuccess = createAction(
  '[Admin Book] Load Books Success',
  props<{ response: BookResponse }>()
);

export const loadAdminBooksFailure = createAction(
  '[Admin Book] Load Books Failure',
  props<{ error: string }>()
);

export const changeAdminBookPage = createAction(
  '[Admin Book] Change Page',
  props<{ page: number; limit: number }>()
);

export const loadAdminBookDetails = createAction(
  '[Admin Book] Load Book Details',
  props<{ id: number }>()
);

export const loadAdminBookDetailsSuccess = createAction(
  '[Admin Book] Load Book Details Success',
  props<{ book: Book }>()
);

export const loadAdminBookDetailsFailure = createAction(
  '[Admin Book] Load Book Details Failure',
  props<{ error: string }>()
);

export const createAdminBook = createAction(
  '[Admin Book] Create Book',
  props<{ book: FormData }>()
);

export const createAdminBookSuccess = createAction(
  '[Admin Book] Create Book Success',
  props<{ book: Book }>()
);

export const createAdminBookFailure = createAction(
  '[Admin Book] Create Book Failure',
  props<{ error: string }>()
);

export const updateAdminBook = createAction(
  '[Admin Book] Update Book',
  props<{ id: number; book: FormData }>()
);

export const updateAdminBookSuccess = createAction(
  '[Admin Book] Update Book Success',
  props<{ book: Book }>()
);

export const updateAdminBookFailure = createAction(
  '[Admin Book] Update Book Failure',
  props<{ error: string }>()
);

export const deleteAdminBook = createAction(
  '[Admin Book] Delete Book',
  props<{ id: number }>()
);

export const deleteAdminBookSuccess = createAction(
  '[Admin Book] Delete Book Success'
);

export const deleteAdminBookFailure = createAction(
  '[Admin Book] Delete Book Failure',
  props<{ error: string }>()
);
