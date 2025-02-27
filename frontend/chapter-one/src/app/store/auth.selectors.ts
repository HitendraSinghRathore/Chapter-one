import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUserProfile = createSelector(
  selectAuthState,
  (state: AuthState) => state.profile
);

export const selectIsAdmin = createSelector(
  selectUserProfile,
  (profile) => profile?.role === 'admin'
);