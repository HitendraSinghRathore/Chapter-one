import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { UserProfile } from '../core/models/user-profile.model';

export interface AuthState {
  profile: UserProfile | null;
  error: string | null;
}

export const initialAuthState: AuthState = {
  profile: null,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state, { profile }) => ({
    ...state,
    profile,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AuthActions.loadProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    error: null,
  })),
  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AuthActions.logoutSuccess,(state) => {
    return {
      ...state,
      profile: null,
      error: null
    }
  } )
);
