import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../common/services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatExpansionModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword implements OnInit {
  resetForm: FormGroup;
  createAdminForm: FormGroup;
  changeRoleForm: FormGroup;

  users: any[] = [];
  filteredUsers!: Observable<any[]>;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) {
    // Reset Password Form
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(5)]]
    });

    // Create Admin Form
    this.createAdminForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role: ['ADMIN', Validators.required]
    });

    // Change Role Form
    this.changeRoleForm = this.fb.group({
      userId: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

 ngOnInit(): void {
  const role = this.authService.getUserRole();
  this.http.get<any[]>('http://localhost:8080/api/users').subscribe({
    next: (data) => {
      // ✅ Role-based filtering
      if (role === 'SUPER_ADMIN') {
        this.users = data; // can see all users
      } else if (role === 'ADMIN') {
        this.users = data.filter(user => user.role.name === 'USER'); // only USER accounts
      } else {
        this.users = []; // fallback
      }

      // setup autocomplete filtering
      this.filteredUsers = this.resetForm.get('email')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    },
    error: () => this.snackBar.open('❌ Failed to load users', 'Close', { duration: 3000 })
  });
}

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user =>
      user.email.toLowerCase().includes(filterValue) ||
      user.fullName.toLowerCase().includes(filterValue)
    );
  }

  onReset(): void {
    if (this.resetForm.valid) {
      const { email, newPassword } = this.resetForm.value;
      this.authService.resetPassword(email, newPassword).subscribe({
        next: () => {
          this.snackBar.open(`✅ Password reset successful for ${email}`, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.resetForm.reset();
        },
        error: () => {
          this.snackBar.open(`❌ Error resetting password for ${email}`, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.snackBar.open('⚠️ Please fix validation errors before submitting', 'Close', { duration: 3000 });
    }
  }

  onCreateAdmin(): void {
    if (this.createAdminForm.valid) {
      this.authService.createAdministrator(this.createAdminForm.value).subscribe({
        next: res => {
          this.snackBar.open(`✅ Admin ${res.fullName} created successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.createAdminForm.reset({ role: 'ADMIN' });
        },
        error: () => {
          this.snackBar.open('❌ Error creating admin', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.snackBar.open('⚠️ Please fix validation errors before submitting', 'Close', { duration: 3000 });
    }
  }

  onChangeRole(): void {
  if (this.changeRoleForm.valid) {
    const { userId, role } = this.changeRoleForm.value;
    this.authService.updateUserRole(userId, role).subscribe({
      next: res => {
        this.snackBar.open(`✅ Role updated to ${res.role}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.changeRoleForm.reset();
      },
      error: () => {
        this.snackBar.open('❌ Error updating role', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  } else {
    this.snackBar.open('⚠️ Please fix validation errors before submitting', 'Close', { duration: 3000 });
  }
}

/** Utility to get allowed roles for Change Role dropdown */
getAllowedRoles(): string[] {
  const currentRole = this.authService.getUserRole();
  if (currentRole === 'SUPER_ADMIN') {
    return ['USER', 'ADMIN'];
  }
  if (currentRole === 'ADMIN') {
    return ['USER'];
  }
  return [];
}

isSuperAdmin(): boolean {
  return this.authService.getUserRole() === 'SUPER_ADMIN';
}

}
