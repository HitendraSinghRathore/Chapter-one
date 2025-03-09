import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../core/models/cart.model';

export const loadCart = createAction('[Cart] Load Cart');

export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ items: CartItem[]; totalCount: number; totalValue: number }>()
);

export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);

export const addCartItem = createAction(
  '[Cart] Add Cart Item',
  props<{ item: Partial<CartItem> }>()
);

export const addCartItemSuccess = createAction(
  '[Cart] Add Cart Item Success',
  props<{ item: CartItem }>()
);

export const addCartItemFailure = createAction(
  '[Cart] Add Cart Item Failure',
  props<{ error: string }>()
);

export const removeCartItem = createAction(
  '[Cart] Remove Cart Item',
  props<{ id: number }>()
);

export const removeCartItemSuccess = createAction(
  '[Cart] Remove Cart Item Success',
  props<{ id: number }>()
);

export const removeCartItemFailure = createAction(
  '[Cart] Remove Cart Item Failure',
  props<{ error: string }>()
);
