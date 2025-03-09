import { createAction, props } from '@ngrx/store';
import { Address } from '../../core/models/address.model';

export const loadAddresses = createAction(
  '[Address] Load Addresses'
);
export const loadAddressesSuccess = createAction(
  '[Address] Load Addresses Success',
  props<{ addresses: Address[] }>()
);
export const loadAddressesFailure = createAction(
  '[Address] Load Addresses Failure',
  props<{ error: string }>()
);

export const loadAddressDetails = createAction(
  '[Address] Load Address Details',
  props<{ id: number }>()
);
export const loadAddressDetailsSuccess = createAction(
  '[Address] Load Address Details Success',
  props<{ address: Address }>()
);
export const loadAddressDetailsFailure = createAction(
  '[Address] Load Address Details Failure',
  props<{ error: string }>()
);

export const createAddress = createAction(
  '[Address] Create Address',
  props<{ address: Partial<Address> }>()
);
export const createAddressSuccess = createAction(
  '[Address] Create Address Success',
  props<{ address: Address }>()
);
export const createAddressFailure = createAction(
  '[Address] Create Address Failure',
  props<{ error: string }>()
);

export const updateAddress = createAction(
  '[Address] Update Address',
  props<{ id: number; address: Partial<Address> }>()
);
export const updateAddressSuccess = createAction(
  '[Address] Update Address Success',
  props<{ address: Address }>()
);
export const updateAddressFailure = createAction(
  '[Address] Update Address Failure',
  props<{ error: string }>()
);
export const deleteAddress = createAction(
  '[Address] Delete Address',
  props<{ id: number }>()
);

export const deleteAddressSuccess = createAction(
  '[Address] Delete Address Success',
  props<{ id: number }>()
);

export const deleteAddressFailure = createAction(
  '[Address] Delete Address Failure',
  props<{ error: string }>()
);
