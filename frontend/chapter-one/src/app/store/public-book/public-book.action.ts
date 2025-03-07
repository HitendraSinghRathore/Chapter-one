import { createAction, props } from '@ngrx/store';
import { BookFilter } from '../../core/models/book.model';
import { BookResponse } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';

export const loadPublicBooks = createAction(
  '[Public Books] Load Books',
  props<{ page?: number; limit?: number; filters?: BookFilter }>()
);

export const loadPublicBooksSuccess = createAction(
  '[Public Books] Load Books Success',
  props<{ response: BookResponse }>()
);

export const loadPublicBooksFailure = createAction(
  '[Public Books] Load Books Failure',
  props<{ error: string }>()
);

export const updatePublicBookFilters = createAction(
  '[Public Books] Update Filters',
  props<{ filters: BookFilter }>()
);

export const changePublicBookPage = createAction(
  '[Public Books] Change Page',
  props<{ page: number; limit: number }>()
);

export const loadPublicBookDetails = createAction(
  '[Public Books] Load Book Details',
  props<{ id: number }>()
);

export const loadPublicBookDetailsSuccess = createAction(
  '[Public Books] Load Book Details Success',
  props<{ book: Book }>()
);

export const loadPublicBookDetailsFailure = createAction(
  '[Public Books] Load Book Details Failure',
  props<{ error: string }>()
);
