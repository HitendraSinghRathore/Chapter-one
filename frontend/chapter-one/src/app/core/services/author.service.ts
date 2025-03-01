/* eslint-disable no-undef */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Author } from '../models/author.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface AuthorResponse {
  data: Author[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SingleAuthorResponse {
  data: Author;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch all authors with pagination.
  getAllAuthors(page = 1, limit = 10): Observable<AuthorResponse> {
    return this.http.get<AuthorResponse>(`${this.API_URL}/authors`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  // Fetch a single author’s details.
  getAuthor(id: number): Observable<Author> {
    return this.http.get<SingleAuthorResponse>(`${this.API_URL}/authors/${id}`)
      .pipe(map(response => response.data));
  }

  // Create a new author using FormData (to include image file)
  createAuthor(author: Partial<Author> & { imageFile?: File }): Observable<Author> {
    const formData = new FormData();
    formData.append('name', author.name || '');
    formData.append('about', author.about || '');
    formData.append('dob', author.dob ? author.dob.toISOString() : '');
    if (author.imageFile) {
      formData.append('image', author.imageFile);
    }
    return this.http.post<Author>(`${this.API_URL}/authors`, formData);
  }

  // Update an existing author using FormData
  updateAuthor(id: number, author: Partial<Author> & { imageFile?: File }): Observable<Author> {
    const formData = new FormData();
    if (author.name) formData.append('name', author.name);
    if (author.about) formData.append('about', author.about);
    if (author.dob) formData.append('dob', author.dob.toISOString());
    if (author.imageFile) {
      formData.append('image', author.imageFile);
    }
    return this.http.put<Author>(`${this.API_URL}/authors/${id}`, formData);
  }

  // Delete an author.
  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/authors/${id}`);
  }
}
