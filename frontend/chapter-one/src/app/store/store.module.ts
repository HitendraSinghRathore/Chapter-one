import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import { AdminGenreEffects } from './admin-genre/admin-genre.effects';
import { adminGenreReducer } from './admin-genre/admin-genre.reducer';
import { adminAuthorReducer } from './admin-author/admin-author.reducer';
import { AdminAuthorEffects } from './admin-author/admin-author.effects';

export const storeProviders = [
  provideStore({ auth: authReducer, adminGenre: adminGenreReducer, adminAuthor: adminAuthorReducer }),
  provideEffects([AuthEffects, AdminGenreEffects, AdminAuthorEffects]),
];