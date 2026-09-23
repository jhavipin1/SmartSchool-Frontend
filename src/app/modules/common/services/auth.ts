import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const BASE_URL = 'http://localhost:8080/api';

export interface AuthResponse {
  token: string;
  expiresIn: number;
  fullName: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Initialize state directly from sessionStorage
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  private fullNameSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('fullName'));
  public fullName$ = this.fullNameSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('role'));
  public role$ = this.roleSubject.asObservable();

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${BASE_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response?.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('fullName', response.fullName || '');
            sessionStorage.setItem('role', response.role || '');

            this.loggedInSubject.next(true);
            this.fullNameSubject.next(response.fullName || null);
            this.roleSubject.next(response.role || null);
          }
        })
      );
  }

  signup(registerData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/auth/signup`, registerData);
  }

  logout(): void {
    sessionStorage.clear();
    this.loggedInSubject.next(false);
    this.fullNameSubject.next(null);
    this.roleSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  getUserRole(): string | null {
    return this.roleSubject.value;
  }

  getFullName(): string | null {
    return this.fullNameSubject.value;
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${BASE_URL}/auth/reset-password/${email}`, { newPassword });
  }

  createAdministrator(registerData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/admins`, registerData);
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${BASE_URL}/users/${id}/role?role=${role}`, {});
  }
}