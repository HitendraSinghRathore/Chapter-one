import { createAction, props } from '@ngrx/store';
import { Genre } from '../../core/models/genre.model';
import { GenreResponse } from '../../core/services/genre.service';

export const loadAdminGenres = createAction(
  '[Admin Genre] Load Genres',
  props<{ page?: number; limit?: number }>()
);
export const loadAdminGenresSuccess = createAction(
  '[Admin Genre] Load Genres Success',
  props<{ response: GenreResponse }>()
);
export const loadAdminGenresFailure = createAction(
  '[Admin Genre] Load Genres Failure',
  props<{ error: string }>()
);

export const changeAdminGenrePage = createAction(
  '[Admin Genre] Change Page',
  props<{ page: number, limit:number }>()
);

export const loadAdminGenreDetails = createAction(
  '[Admin Genre] Load Genre Details',
  props<{ id: number }>()
);
export const loadAdminGenreDetailsSuccess = createAction(
  '[Admin Genre] Load Genre Details Success',
  props<{ genre: Genre }>()
);
export const loadAdminGenreDetailsFailure = createAction(
  '[Admin Genre] Load Genre Details Failure',
  props<{ error: string }>()
);

export const createAdminGenre = createAction(
  '[Admin Genre] Create Genre',
  props<{ genre: Partial<Genre> }>()
);
export const createAdminGenreSuccess = createAction(
  '[Admin Genre] Create Genre Success',
  props<{ genre: Genre }>()
);
export const createAdminGenreFailure = createAction(
  '[Admin Genre] Create Genre Failure',
  props<{ error: string }>()
);

export const updateAdminGenre = createAction(
  '[Admin Genre] Update Genre',
  props<{ id: number; genre: Partial<Genre> }>()
);
export const updateAdminGenreSuccess = createAction(
  '[Admin Genre] Update Genre Success',
  props<{ genre: Genre }>()
);
export const updateAdminGenreFailure = createAction(
  '[Admin Genre] Update Genre Failure',
  props<{ error: string }>()
);

export const deleteAdminGenre = createAction(
  '[Admin Genre] Delete Genre',
  props<{ id: number }>()
);
export const deleteAdminGenreSuccess = createAction(
  '[Admin Genre] Delete Genre Success'
);
export const deleteAdminGenreFailure = createAction(
  '[Admin Genre] Delete Genre Failure',
  props<{ error: string }>()
);
