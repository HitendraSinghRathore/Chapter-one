/* eslint-disable no-undef */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, BookListItem } from '../models/book.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BookResponse {
  data: BookListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SingleBookResponse {
  data: Book;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllBooks(page = 1, limit = 10): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.API_URL}/books`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<SingleBookResponse>(`${this.API_URL}/books/${id}`)
      .pipe(map(response => response.data));
  }

  createBook(bookData: FormData): Observable<Book> {
    return this.http.post<Book>(`${this.API_URL}/books`, bookData);
  }

  updateBook(id: number, bookData: FormData): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/books/${id}`, bookData);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/books/${id}`);
  }
}
