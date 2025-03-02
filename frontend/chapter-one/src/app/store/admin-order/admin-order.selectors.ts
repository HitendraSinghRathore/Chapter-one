import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminOrderState } from './admin-order.state';

export const selectAdminOrderState = createFeatureSelector<AdminOrderState>('adminOrder');

export const selectAllAdminOrders = createSelector(
  selectAdminOrderState,
  state => state.orders
);

export const selectAdminOrderLoading = createSelector(
  selectAdminOrderState,
  state => state.loading
);