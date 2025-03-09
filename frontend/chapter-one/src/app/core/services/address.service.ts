import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address } from '../models/address.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddressResponse } from '../../store/address/address.state';

export interface AddressListResponse {
  data: Address[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<AddressListResponse> {
    return this.http.get<AddressListResponse>(`${this.API_URL}/addresses`);
  }

  getAddress(id: number): Observable<AddressResponse> {
    return this.http.get<AddressResponse>(`${this.API_URL}/addresses/${id}`);
  }

  createAddress(addressData: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(`${this.API_URL}/addresses`, addressData);
  }

  updateAddress(id: number, addressData: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.API_URL}/addresses/${id}`, addressData);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/addresses/${id}`);
  }
}
