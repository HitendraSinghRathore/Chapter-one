import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';

export const storeProviders = [
  provideStore({ auth: authReducer }),
  provideEffects([AuthEffects]),
];