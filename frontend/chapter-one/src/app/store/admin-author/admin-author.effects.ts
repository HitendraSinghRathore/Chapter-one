import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AdminAuthorActions from './admin-author.actions';
import { AuthorService } from '../../core/services/author.service';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AdminAuthorEffects {
  private actions$ = inject(Actions);
  private authorService = inject(AuthorService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loadAdminAuthors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.loadAdminAuthors, AdminAuthorActions.changeAdminAuthorPage),
      mergeMap((action) => {
        const currentPage = action?.page || 1;
        const currentLimit = action?.limit || 10;
        return this.authorService.getAllAuthors(currentPage, currentLimit).pipe(
          map(response => AdminAuthorActions.loadAdminAuthorsSuccess({ response })),
          catchError(error =>
            of(AdminAuthorActions.loadAdminAuthorsFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadAdminAuthorDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.loadAdminAuthorDetails),
      mergeMap(({ id }) =>
        this.authorService.getAuthor(id).pipe(
          map(author => AdminAuthorActions.loadAdminAuthorDetailsSuccess({ author })),
          catchError(error => {
            this.snackBar.open(error?.error?.message || 'Failed to load author', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
            return of(AdminAuthorActions.loadAdminAuthorDetailsFailure({ error: error.message }))
          }
          )
        )
      )
    )
  );

  createAdminAuthor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.createAdminAuthor),
      mergeMap(({ author }) =>
        this.authorService.createAuthor(author).pipe(
          map(newAuthor => AdminAuthorActions.createAdminAuthorSuccess({ author: newAuthor })),
          catchError(error => of(AdminAuthorActions.createAdminAuthorFailure({ error: error.message })))
        )
      )
    )
  );

  createAdminAuthorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.createAdminAuthorSuccess),
      tap(() => {
        this.snackBar.open('Author created successfully', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        this.router.navigate(['/admin/author']);
      })
    ),
    { dispatch: false }
  );

  createAdminAuthorFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.createAdminAuthorFailure),
      tap(({ error }) => {
        this.snackBar.open(error || 'Failed to create author', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
      })
    ),
    { dispatch: false }
  );

  updateAdminAuthor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.updateAdminAuthor),
      mergeMap(({ id, author }) =>
        this.authorService.updateAuthor(id, author).pipe(
          map(updatedAuthor => {
          
            return AdminAuthorActions.updateAdminAuthorSuccess({ author: updatedAuthor })}),
          catchError(error => of(AdminAuthorActions.updateAdminAuthorFailure({ error: error.message })))
        )
      )
    )
  );

  updateAdminAuthorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.updateAdminAuthorSuccess),
      tap(() => {
        this.snackBar.open('Author updated successfully', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        this.router.navigate(['/admin/author']);
      })
    ),
    { dispatch: false }
  );

  updateAdminAuthorFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.updateAdminAuthorFailure),
      tap(({ error }) => {
        this.snackBar.open(error || 'Failed to update author', 'OK', { duration: 3000 });
      })
    ),
    { dispatch: false }
  );

  deleteAdminAuthor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminAuthorActions.deleteAdminAuthor),
      mergeMap(({ id }) =>
        this.authorService.deleteAuthor(id).pipe(
          map(() => AdminAuthorActions.deleteAdminAuthorSuccess()),
          tap(() => {
            this.snackBar.open('Author deleted successfully', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
            this.router.navigate(['/admin/author']);
          }),
          catchError(error => {
            this.snackBar.open(error?.error?.message || 'Failed to delete author', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
            return of(AdminAuthorActions.deleteAdminAuthorFailure({ error: error.message }))
          }
          )
        )
      )
    )
  );
}
