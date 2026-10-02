import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './signin-form.component.html',
})
export class SigninFormComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  isChecked = false;

  email = '';
  password = '';

  loading = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSignIn(): void {

    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.loading = true;

    this.authService.login({
      identifier: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {

        this.loading = false;

        if (!response?.token) {
          alert('Invalid credentials');
          return;
        }

        sessionStorage.setItem('token', response.token);

        sessionStorage.setItem('user', JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role
        }));

        sessionStorage.setItem('role', response.role ?? '');
       console.log(response)
        this.router.navigate(['/']);
      },

      error: (error) => {
        this.loading = false;

        console.error('Login Error:', error);

        alert(
          error?.error?.message ||
          'Login failed. Please check your credentials.'
        );
      }
    });
  }
}