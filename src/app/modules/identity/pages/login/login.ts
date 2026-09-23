import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../common/services/auth';

// Services (Ensure correct import path)


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Inject dependencies using Angular's inject() function
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: { token?: string; fullName?: string; role?: string }) => {
        if (!response?.token) {
          this.snackBar.open('Invalid user credentials', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          return;
        }

        // Persist session variables
        sessionStorage.setItem('token', response.token);
        if (response.fullName) sessionStorage.setItem('fullName', response.fullName);
        if (response.role) sessionStorage.setItem('role', response.role);

        this.snackBar.open('Successfully logged in!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        // Redirect based on role
        this.navigateByRole(response.role);
      },
      error: () => {
        this.snackBar.open('Invalid user credentials', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  private navigateByRole(role?: string): void {
    const routeMap: Record<string, string> = {
      'USER': '/dashboard/user',
      'ADMIN': '/dashboard/admin',
      'SUPER_ADMIN': '/dashboard/superadmin'
    };

    const targetRoute = (role && routeMap[role]) ? routeMap[role] : '/dashboard';
    this.router.navigate([targetRoute]);
  }
}