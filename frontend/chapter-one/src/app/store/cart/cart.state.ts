import { CartState } from '../../core/models/cart.model';

export const initialCartState: CartState = {
  items: [],
  totalCount: 0,
  totalValue: 0,
  loading: false,
  error: null,
};
