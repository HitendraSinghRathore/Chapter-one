import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AdminOrderActions from './admin-order.actions';
import { OrderService } from '../../core/services/order.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AdminOrderEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);

  loadAdminOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminOrderActions.loadAdminOrders),
      mergeMap(() =>
        this.orderService.getAllOrders().pipe(
          map(response => AdminOrderActions.loadAdminOrdersSuccess({ orders: response.data })),
          catchError(error => of(AdminOrderActions.loadAdminOrdersFailure({ error: error.message })))
        )
      )
    )
  );


}
