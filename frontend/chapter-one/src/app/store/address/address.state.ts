import { Address } from '../../core/models/address.model';

export interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  error: string | null;
}

export const initialAddressState: AddressState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

export interface AddressResponse {
  data: Address;
}