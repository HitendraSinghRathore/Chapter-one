import { createAction, props } from '@ngrx/store';
import { Order } from '../../core/models/order.model';

export const loadAdminOrders = createAction('[Admin Order] Load Orders');

export const loadAdminOrdersSuccess = createAction(
  '[Admin Order] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const loadAdminOrdersFailure = createAction(
  '[Admin Order] Load Orders Failure',
  props<{ error: string }>()
);