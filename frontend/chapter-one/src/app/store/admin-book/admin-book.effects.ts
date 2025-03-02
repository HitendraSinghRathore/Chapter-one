import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AdminBookActions from './admin-book.actions';
import { BookService } from '../../core/services/book.service';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AdminBookEffects {
  private actions$ = inject(Actions);
  private bookService = inject(BookService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loadAdminBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.loadAdminBooks, AdminBookActions.changeAdminBookPage),
      mergeMap(({ page, limit }) => {
        const currentPage = page || 1;
        const currentLimit = limit || 10;
        return this.bookService.getAllBooks(currentPage, currentLimit).pipe(
          map(response => AdminBookActions.loadAdminBooksSuccess({ response })),
          catchError(error =>
            of(AdminBookActions.loadAdminBooksFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadAdminBookDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.loadAdminBookDetails),
      mergeMap(({ id }) =>
        this.bookService.getBook(id).pipe(
          map(book => AdminBookActions.loadAdminBookDetailsSuccess({ book })),
          catchError(error =>
            of(AdminBookActions.loadAdminBookDetailsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createAdminBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.createAdminBook),
      mergeMap(({ book }) =>
        this.bookService.createBook(book).pipe(
          map(newBook => AdminBookActions.createAdminBookSuccess({ book: newBook })),
          catchError(error => of(AdminBookActions.createAdminBookFailure({ error: error.message })))
        )
      )
    )
  );

  createAdminBookSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.createAdminBookSuccess),
      tap(() => {
        this.snackBar.open('Book created successfully', 'OK', { duration: 3000 });
        this.router.navigate(['/admin/book']);
      })
    ),
    { dispatch: false }
  );

  createAdminBookFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.createAdminBookFailure),
      tap(({ error }) => {
        this.snackBar.open(error || 'Failed to create book', 'OK', { duration: 3000 });
      })
    ),
    { dispatch: false }
  );

  updateAdminBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.updateAdminBook),
      mergeMap(({ id, book }) =>
        this.bookService.updateBook(id, book).pipe(
          map(updatedBook => AdminBookActions.updateAdminBookSuccess({ book: updatedBook })),
          catchError(error =>
            of(AdminBookActions.updateAdminBookFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateAdminBookSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.updateAdminBookSuccess),
      tap(() => {
        this.snackBar.open('Book updated successfully', 'OK', { duration: 3000 });
        this.router.navigate(['/admin/book']);
      })
    ),
    { dispatch: false }
  );

  updateAdminBookFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.updateAdminBookFailure),
      tap(({ error }) => {
        this.snackBar.open(error || 'Failed to update book', 'OK', { duration: 3000 });
      })
    ),
    { dispatch: false }
  );

  deleteAdminBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminBookActions.deleteAdminBook),
      mergeMap(({ id }) =>
        this.bookService.deleteBook(id).pipe(
          map(() => AdminBookActions.deleteAdminBookSuccess()),
          tap(() => {
            this.snackBar.open('Book deleted successfully', 'OK', { duration: 3000 });
            this.router.navigate(['/admin/book']);
          }),
          catchError(error =>
            of(AdminBookActions.deleteAdminBookFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
