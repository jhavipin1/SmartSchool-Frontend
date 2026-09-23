import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
const BASE_URL = 'http://localhost:8080/api';


export interface UserRole {
  name: string;
  description: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  enabled: boolean;
  role?: UserRole;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${BASE_URL}/users/me`;

  user$!: Observable<UserProfile | null>;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    // Authorization headers are automatically injected by AuthInterceptor
    this.user$ = this.http.get<UserProfile>(this.API_URL).pipe(
      tap(() => (this.errorMessage = '')),
      catchError((err) => {
        this.errorMessage = err?.error?.message || 'Failed to load user profile details.';
        return of(null);
      })
    );
  }
}