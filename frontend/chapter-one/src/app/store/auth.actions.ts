import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../core/models/user-profile.model';

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