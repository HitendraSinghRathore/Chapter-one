import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../models/cart.model';

export interface OutOfStock{
    bookId: number;
    name: string;
    requested: number;
    available: number;
}
export interface CartResponse {
  items: CartItem[];
  total: number;
  outOfStock: OutOfStock[]
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.API_URL}/cart`);
  }

  addCartItem(item: Partial<CartItem>): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.API_URL}/cart/add`, item);
  }

  removeCartItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/cart/item/${id}`);
  }
}
