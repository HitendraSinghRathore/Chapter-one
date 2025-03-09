import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AddressActions from './address.actions';
import { AddressService } from '../../core/services/address.service';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Injectable()
export class AddressEffects {
  private actions$ = inject(Actions);
  private addressService = inject(AddressService);
  private router = inject(Router);
  private location = inject(Location);
  private snackBar = inject(MatSnackBar);

  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadAddresses),
      mergeMap(() =>
        this.addressService.getAddresses().pipe(
          map(addresses => AddressActions.loadAddressesSuccess({ addresses: addresses.data })),
          catchError(error => of(AddressActions.loadAddressesFailure({ error: error.message })))
        )
      )
    )
  );

  loadAddressDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadAddressDetails),
      mergeMap(({ id }) =>
        this.addressService.getAddress(id).pipe(
          map(address => AddressActions.loadAddressDetailsSuccess({ address: address.data })),
          catchError(error => of(AddressActions.loadAddressDetailsFailure({ error: error.message })))
        )
      )
    )
  );

  createAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.createAddress),
      mergeMap(({ address }) =>
        this.addressService.createAddress(address).pipe(
          map(newAddress => AddressActions.createAddressSuccess({ address: newAddress })),
          catchError(error => of(AddressActions.createAddressFailure({ error: error.message })))
        )
      )
    )
  );

  updateAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.updateAddress),
      mergeMap(({ id, address }) =>
        this.addressService.updateAddress(id, address).pipe(
          map(updatedAddress => AddressActions.updateAddressSuccess({ address: updatedAddress })),
          catchError(error => of(AddressActions.updateAddressFailure({ error: error.message })))
        )
      )
    )
  );

  createAddressSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.createAddressSuccess),
      tap(() => {
        this.snackBar.open('Address created successfully', 'OK', { duration: 3000 });
        this.location.back();
        // this.router.navigate(['/checkout']);
      })
    ),
    { dispatch: false }
  );

  updateAddressSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.updateAddressSuccess),
      tap(() => {
        this.snackBar.open('Address updated successfully', 'OK', { duration: 3000 });
        this.location.back();
        this.router.navigate(['/checkout']);
      })
    ),
    { dispatch: false }
  );
  deleteAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.deleteAddress),
      mergeMap(({ id }) =>
        this.addressService.deleteAddress(id).pipe(
          map(() => AddressActions.deleteAddressSuccess({ id })),
          catchError(error => of(AddressActions.deleteAddressFailure({ error: error.message })))
        )
      )
    )
  );
  deleteAddressSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AddressActions.deleteAddressSuccess),
        tap(() => {
          this.snackBar.open('Address deleted successfully', 'OK', { duration: 3000 });
          this.location.back();
          // this.router.navigate(['/checkout']);
        })
      ),
    { dispatch: false }
  );
  deleteAddressFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AddressActions.deleteAddressFailure),
        tap(({ error }) => {
          this.snackBar.open(error || 'Failed to delete address', 'OK', { duration: 3000 });
        })
      ),
    { dispatch: false }
  );
}
