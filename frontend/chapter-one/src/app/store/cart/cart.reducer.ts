import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { initialCartState } from './cart.state';

export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.loadCart, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CartActions.loadCartSuccess, (state, { items, totalCount, totalValue }) => ({
    ...state,
    items,
    totalCount,
    totalValue,
    loading: false
  })),
  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(CartActions.addCartItem, (state, { item }) => {
    return { ...state,loading: true };
  }),
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   on(CartActions.removeCartItem, (state, { id }) => {
    return { ...state,loading: true };
  }),
  on(CartActions.addCartItemSuccess, (state, { item }) => {
    const existingIndex = state.items.findIndex(i => i.id === item.id);
    let updatedItems;
    if (existingIndex >= 0) {
      updatedItems = state.items.map(i => i.id === item.id ? item : i);
    } else {
      updatedItems = [...state.items, item];
    }
    const totalCount = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
    const totalValue = updatedItems.reduce((acc, i) => acc + i.totalCost, 0);
    return { ...state, items: updatedItems, totalCount, totalValue };
  }),
  on(CartActions.removeCartItemSuccess, (state, { id }) => {
    const updatedItems = state.items.filter(item => item.id !== id);
    const totalCount = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
    const totalValue = updatedItems.reduce((acc, i) => acc + i.totalCost, 0);
    return { ...state, items: updatedItems, totalCount, totalValue };
  })
);
