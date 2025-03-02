import { Order } from "../../core/models/order.model";

export interface AdminOrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
  }
  
  export const initialAdminOrderState: AdminOrderState = {
    orders: [],
    loading: false,
    error: null,
  };