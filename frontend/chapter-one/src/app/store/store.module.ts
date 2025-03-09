import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import { AdminGenreEffects } from './admin-genre/admin-genre.effects';
import { adminGenreReducer } from './admin-genre/admin-genre.reducer';
import { adminAuthorReducer } from './admin-author/admin-author.reducer';
import { AdminAuthorEffects } from './admin-author/admin-author.effects';
import { AdminBookEffects } from './admin-book/admin-book.effects';
import { adminBookReducer } from './admin-book/admin-book.reducer';
import { AdminOrderEffects } from './admin-order/admin-order.effects';
import { adminOrderReducer } from './admin-order/admin-order.reducer';
import { publicBooksReducer } from './public-book/public-book.reducer';
import { PublicBookEffects } from './public-book/public-book.effect';
import { cartReducer } from './cart/cart.reducer';
import { CartEffects } from './cart/cart.effects';
import { addressReducer } from './address/address.reducer';
import { AddressEffects } from './address/address.effects';

export const storeProviders = [
  provideStore({ 
    auth: authReducer, 
    adminGenre: adminGenreReducer, 
    adminAuthor: adminAuthorReducer, 
    adminBook: adminBookReducer, 
    adminOrder: adminOrderReducer,
    publicBooks: publicBooksReducer,
    cart: cartReducer,
    address: addressReducer,
    
  }),
  provideEffects([
    AuthEffects, 
    AdminGenreEffects, 
    AdminAuthorEffects, 
    AdminBookEffects, 
    AdminOrderEffects,
    PublicBookEffects,
    CartEffects,
    AddressEffects

  ]),
];