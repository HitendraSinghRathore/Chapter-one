/*  global localStorage */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../core/services/auth.service';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ loginValue, password }) =>
        this.authService.login(loginValue, password).pipe(
          map(response => {
            this.authService.setToken(response.token);
            localStorage.removeItem('sessionId');
            return AuthActions.loginSuccess({
              accessToken: response.token,
              profile: response.user,
              message: response.message
            });
          }),
          catchError(error => {
            const message = error?.error?.message || error?.message;
             return of(AuthActions.loginFailure({ error: message }))})
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ profile, message }) => {
          this.snackBar.open(message || 'Login successful', 'close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
          if (profile.roles.includes('admin')) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );
  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({error}) => {
          this.snackBar.open(error || 'Login failed, please try again.', 'close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        })
      ),
    { dispatch: false }
  );
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      mergeMap(() =>
        this.authService.getProfile().pipe(
          map(profile => AuthActions.loadProfileSuccess({ profile })),
          catchError(error => {
            return of(AuthActions.loadProfileFailure({ error }))})
        )
      )
    )
  );
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(response => AuthActions.logoutSuccess({ message: response?.message })),
          catchError(error => {
            return of(AuthActions.logoutFailure({ error }))})
        )
      )
    )
  );
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(({ message }) => {
          localStorage.removeItem('authToken');
          const sessionId =  uuidv4();
          this.authService.setSessionId(sessionId);
          this.snackBar.open(message || 'Logout successful', 'close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/'])
         
        })
      ),
    { dispatch: false }
  );
  logoutFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutFailure),
        tap(({error}) => {
          this.snackBar.open(error || 'Logout failed, please try again.', 'close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        })
      ),
    { dispatch: false }
  );
}
