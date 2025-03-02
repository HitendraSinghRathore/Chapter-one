import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Order } from "../models/order.model";
import { Observable } from "rxjs";


export interface OrderResponse {
    data: Order[];
  }
  
@Injectable({
    providedIn: 'root'
})
export class OrderService { 
    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAllOrders(): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${this.API_URL}/orders/admin`);
    }
}