export interface CartItem {
    id: number;
    bookId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    totalCost: number;
  }
  
  export interface CartState {
    items: CartItem[];
    totalCount: number;
    totalValue: number;
    loading: boolean;
    error: string | null;
  }
  