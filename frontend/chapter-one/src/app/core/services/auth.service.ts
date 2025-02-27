/* global localStorage */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  user: UserProfile;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/profile`);
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API_URL}/profile`, profile);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password });
  }

  signup(firstName: string, lastName: string, email: string, password: string, mobile: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/signup`, { firstName, lastName, email, password, mobile });
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
  setSessionId(sessionId: string): void {
    localStorage.setItem('sessionId', sessionId);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  getSessionId(): string | null {
    return localStorage.getItem('sessionId');
  }
  isLoggedIn(): boolean {
    return this.getToken() !== null || this.getSessionId() !== null;
  }
}
