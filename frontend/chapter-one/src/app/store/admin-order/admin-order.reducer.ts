import { createReducer, on } from '@ngrx/store';
import * as AdminOrderActions from './admin-order.actions';
import { initialAdminOrderState } from './admin-order.state';

export const adminOrderReducer = createReducer(
  initialAdminOrderState,
  on(AdminOrderActions.loadAdminOrders, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AdminOrderActions.loadAdminOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false
  })),
  on(AdminOrderActions.loadAdminOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);