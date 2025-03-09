import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CartActions from './cart.actions';
import { CartService } from '../../core/services/cart.service';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      mergeMap(() =>
        this.cartService.getCart().pipe(
          map(response =>
            CartActions.loadCartSuccess({ 
              items: response.items, 
              totalCount: response.items.reduce((acc, i) => acc + i.quantity, 0),
              totalValue: response.total 
            })
          ),
          catchError(error => of(CartActions.loadCartFailure({ error: error.message })))
        )
      )
    )
  );

  addCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addCartItem),
      mergeMap(({ item }) =>
        this.cartService.addCartItem(item).pipe(
          map(addedItem => CartActions.addCartItemSuccess({ item: addedItem })),
          catchError(error => of(CartActions.addCartItemFailure({ error: error.message })))
        )
      )
    )
  );
  addCartItemFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartItemFailure),
        tap(({ error }) => {
          this.snackBar.open(error || 'Failed to add item to cart', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        })
      ),
    { dispatch: false }
  );

  addCartItemSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartItemSuccess),
        tap(() => {
        this.store.dispatch(CartActions.loadCart());  
          this.snackBar.open('Item added to cart successfully', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        })
      ),
    { dispatch: false }
  );

  removeCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeCartItem),
      mergeMap(({ id }) =>
        this.cartService.removeCartItem(id).pipe(
          map(() => CartActions.removeCartItemSuccess({ id })),
          catchError(error => of(CartActions.removeCartItemFailure({ error: error.message })))
        )
      )
    )
  );
  removeCartItemSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.removeCartItemSuccess),
        tap(() => {
        this.store.dispatch(CartActions.loadCart());  
        this.snackBar.open('Item removed from cart successfully', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        })
      ),
    { dispatch: false }
  );
  removeCartItemFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.removeCartItemFailure),
        tap(({ error }) => {
          this.snackBar.open(error || 'Failed to remove item from cart', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        })
      ),
    { dispatch: false }
  );
}


