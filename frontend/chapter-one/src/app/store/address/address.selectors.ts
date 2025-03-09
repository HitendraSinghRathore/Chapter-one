import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AddressState } from './address.state';

export const selectAddressState = createFeatureSelector<AddressState>('address');

export const selectAllAddresses = createSelector(
  selectAddressState,
  (state: AddressState) => state.addresses
);

export const selectAddressLoading = createSelector(
  selectAddressState,
  (state: AddressState) => state.loading
);

export const selectSelectedAddress = createSelector(
  selectAddressState,
  (state: AddressState) => state.selectedAddress
);
