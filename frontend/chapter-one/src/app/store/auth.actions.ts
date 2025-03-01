import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../core/models/user-profile.model';

export const login = createAction(
  '[Auth] Login',
  props<{ loginValue: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string; profile: UserProfile; message: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
export const loadProfile = createAction(
  '[Auth] Load profile'
);

export const loadProfileSuccess = createAction(
  '[Auth] Load profile success',
  props<{ profile: UserProfile }>()
);

export const loadProfileFailure = createAction(
  '[Auth] Load profile failure',
  props<{ error: string }>()
);
export const logout = createAction(
  '[Auth] Logout'
);
export const logoutSuccess = createAction(
  '[Auth] Logout success',
  props<{ message: string }>()
);
export const logoutFailure = createAction(
  '[Auth] Logout failure',
  props<{ error: string }>()
);