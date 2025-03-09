import { createReducer, on } from '@ngrx/store';
import * as AddressActions from './address.actions';
import { initialAddressState } from './address.state';

export const addressReducer = createReducer(
  initialAddressState,
  on(AddressActions.loadAddresses, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AddressActions.loadAddressesSuccess, (state, { addresses }) => ({
    ...state,
    addresses: addresses,
    loading: false
  })),
  on(AddressActions.loadAddressesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AddressActions.loadAddressDetails, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AddressActions.loadAddressDetailsSuccess, (state, { address }) => ({
    ...state,
    selectedAddress: address,
    loading: false
  })),
  on(AddressActions.loadAddressDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AddressActions.createAddressSuccess, (state, { address }) => ({
    ...state,
    addresses: [...state.addresses, address],
    selectedAddress: address
  })),
  on(AddressActions.updateAddressSuccess, (state, { address }) => ({
    ...state,
    addresses: state.addresses.map(a => a.id === address.id ? address : a),
    selectedAddress: address
  }))
);
