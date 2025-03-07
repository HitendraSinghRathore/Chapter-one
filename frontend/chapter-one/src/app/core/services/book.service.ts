/* eslint-disable no-undef */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, BookFilter, BookListItem } from '../models/book.model';
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
  getAllBooks(page = 1, limit = 10, filters?: BookFilter): Observable<BookResponse> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params:any = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (filters) {
      if (filters.minPrice !== null && filters.minPrice !== undefined) params.minPrice = filters.minPrice.toString();
      if (filters.maxPrice !== null && filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice.toString();
      if (filters.authorId !== null && filters.authorId !== undefined) params.authorId = filters.authorId.toString();
      if (filters.genreIds && filters.genreIds.length > 0) {
        params.genreIds = filters.genreIds.join(',');
      }
      if (filters.searchQuery) {
        params.searchQuery = filters.searchQuery;
      }
    }
    return this.http.get<BookResponse>(`${this.API_URL}/books`, { params });
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
  fetchPrice(): Observable<{ min: number; max: number }> {
    return this.http.get<{ min: number; max: number }>(`${this.API_URL}/books/prices`);
  }
}
