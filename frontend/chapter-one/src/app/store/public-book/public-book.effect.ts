import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PublicBookActions from './public-book.action';
import { BookService } from '../../core/services/book.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PublicBookEffects {
  private actions$ = inject(Actions);
  private bookService = inject(BookService);

  loadPublicBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PublicBookActions.loadPublicBooks),
      mergeMap(({ page, limit, filters }) =>
        this.bookService.getAllBooks(page || 1, limit || 10, filters).pipe(
          map(response => PublicBookActions.loadPublicBooksSuccess({ response })),
          catchError(error => of(PublicBookActions.loadPublicBooksFailure({ error: error.message })))
        )
      )
    )
  );

  loadPublicBookDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PublicBookActions.loadPublicBookDetails),
      mergeMap(({ id }) =>
        this.bookService.getBook(id).pipe(
          map(book => PublicBookActions.loadPublicBookDetailsSuccess({ book })),
          catchError(error => of(PublicBookActions.loadPublicBookDetailsFailure({ error: error.message })))
        )
      )
    )
  );
}
