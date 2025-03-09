import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from '../../core/models/cart.model';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

export const selectCartTotalCount = createSelector(
  selectCartState,
  (state: CartState) => state.totalCount
);

export const selectCartTotalValue = createSelector(
  selectCartState,
  (state: CartState) => state.totalValue
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state.loading
);
