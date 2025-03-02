import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../models/genre.model';
import { environment } from '../../environments/environment';

export interface GenreResponse {
  data: Genre[];
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
export class GenreService {
  private readonly API_URL = environment.apiUrl ;

  constructor(private http: HttpClient) {}
  fetchAllGenres() {
    return this.http.get<GenreResponse>(`${this.API_URL}/genres`);
  }
  getAllGenres(page = 1, limit = 10): Observable<GenreResponse> {
    return this.http.get<GenreResponse>(`${this.API_URL}/genres`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }
  createGenre(genre: Partial<Genre>): Observable<Genre> {
    return this.http.post<Genre>(`${this.API_URL}/genres`, genre);
  }
  getGenre(id: number): Observable<{data:Genre}> {
    return this.http.get<{data: Genre}>(`${this.API_URL}/genres/${id}`);
  }

  updateGenre(id: number, genre: Partial<Genre>): Observable<Genre> {
    return this.http.put<Genre>(`${this.API_URL}/genres/${id}`, genre);
  }

  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/genres/${id}`);
  }
}
