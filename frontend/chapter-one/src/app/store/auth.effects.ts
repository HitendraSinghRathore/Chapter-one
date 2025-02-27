import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../core/services/auth.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      mergeMap(() =>
        this.authService.getProfile().pipe(
          map(profile => AuthActions.loadProfileSuccess({ profile })),
          catchError(error => of(AuthActions.loadProfileFailure({ error })))
        )
      )
    )
  );
}
