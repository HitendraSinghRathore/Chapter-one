/* eslint-disable no-undef */
import { createAction, props } from '@ngrx/store';
import { Author } from '../../core/models/author.model';
import { AuthorResponse } from '../../core/services/author.service';

export const loadAdminAuthors = createAction(
  '[Admin Author] Load Authors',
  props<{ page?: number; limit?: number }>()
);

export const loadAdminAuthorsSuccess = createAction(
  '[Admin Author] Load Authors Success',
  props<{ response: AuthorResponse }>()
);

export const loadAdminAuthorsFailure = createAction(
  '[Admin Author] Load Authors Failure',
  props<{ error: string }>()
);

export const changeAdminAuthorPage = createAction(
  '[Admin Author] Change Page',
  props<{ page: number, limit: number }>()
);

export const loadAdminAuthorDetails = createAction(
  '[Admin Author] Load Author Details',
  props<{ id: number }>()
);

export const loadAdminAuthorDetailsSuccess = createAction(
  '[Admin Author] Load Author Details Success',
  props<{ author: Author }>()
);

export const loadAdminAuthorDetailsFailure = createAction(
  '[Admin Author] Load Author Details Failure',
  props<{ error: string }>()
);

export const createAdminAuthor = createAction(
  '[Admin Author] Create Author',
  props<{ author: Partial<Author> & { imageFile?: File } }>()
);

export const createAdminAuthorSuccess = createAction(
  '[Admin Author] Create Author Success',
  props<{ author: Author }>()
);

export const createAdminAuthorFailure = createAction(
  '[Admin Author] Create Author Failure',
  props<{ error: string }>()
);

export const updateAdminAuthor = createAction(
  '[Admin Author] Update Author',
  props<{ id: number; author: Partial<Author> & { imageFile?: File } }>()
);

export const updateAdminAuthorSuccess = createAction(
  '[Admin Author] Update Author Success',
  props<{ author: Author }>()
);

export const updateAdminAuthorFailure = createAction(
  '[Admin Author] Update Author Failure',
  props<{ error: string }>()
);

export const deleteAdminAuthor = createAction(
  '[Admin Author] Delete Author',
  props<{ id: number }>()
);

export const deleteAdminAuthorSuccess = createAction(
  '[Admin Author] Delete Author Success'
);

export const deleteAdminAuthorFailure = createAction(
  '[Admin Author] Delete Author Failure',
  props<{ error: string }>()
);
