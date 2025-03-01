import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AdminGenreActions from './admin-genre.actions';
import { GenreService } from '../../core/services/genre.service';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AdminGenreEffects {
  private actions$ = inject(Actions);
  private genreService = inject(GenreService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loadAdminGenres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminGenreActions.loadAdminGenres, AdminGenreActions.changeAdminGenrePage),
      mergeMap(action => {
        const page = action.page || 1;
        const limit = action.limit || 10;
        return this.genreService.getAllGenres(page, limit).pipe(
          map(response => AdminGenreActions.loadAdminGenresSuccess({ response })),
          catchError(error =>
            of(AdminGenreActions.loadAdminGenresFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadAdminGenreDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminGenreActions.loadAdminGenreDetails),
      mergeMap(({ id }) =>
        this.genreService.getGenre(id).pipe(
          map(genre => AdminGenreActions.loadAdminGenreDetailsSuccess({ genre: genre.data })),
          catchError(error => of(AdminGenreActions.loadAdminGenreDetailsFailure({ error: error.message })))
        )
      )
    )
  );
  createAdminGenre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminGenreActions.createAdminGenre),
      mergeMap(({ genre }) =>
        this.genreService.createGenre(genre).pipe(
          map(createdGenre => {
            this.snackBar.open('Genre created successfully', 'close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
            this.router.navigate(['/admin/genre']);
            return AdminGenreActions.createAdminGenreSuccess({ genre: createdGenre })
        }),
          catchError(error => of(AdminGenreActions.createAdminGenreFailure({ error: error.message })))
        )
      )
    )
  );

  updateAdminGenre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminGenreActions.updateAdminGenre),
      mergeMap(({ id, genre }) =>
        this.genreService.updateGenre(id, genre).pipe(
          map(updatedGenre => { 
            this.snackBar.open('Genre updated successfully', 'close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
            this.router.navigate(['/admin/genre']);
            return AdminGenreActions.updateAdminGenreSuccess({ genre: updatedGenre })
        }),
          catchError(error => of(AdminGenreActions.updateAdminGenreFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAdminGenre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminGenreActions.deleteAdminGenre),
      mergeMap(({ id }) =>
        this.genreService.deleteGenre(id).pipe(
          map(() => AdminGenreActions.deleteAdminGenreSuccess()),
          tap(() => {
            this.snackBar.open('Genre deleted successfully', 'close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
            AdminGenreActions.changeAdminGenrePage({ page: 1 , limit: 10});
            AdminGenreActions.loadAdminGenres({ page: 1, limit: 10 });
          }),
          catchError(error => of(AdminGenreActions.deleteAdminGenreFailure({ error: error.message })))
        )
      )
    )
  );
}
