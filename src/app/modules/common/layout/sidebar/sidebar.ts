import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ]
})
export class SidebarComponent {
  public authService = inject(AuthService);

  opened = true;
  collapsed = false;

  get userRole(): string {
    const role = this.authService.getUserRole();
    return role ? role.toUpperCase().replace('ROLE_', '') : '';
  }

  get isUser(): boolean {
    return this.userRole === 'USER';
  }

  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  get isSuperAdmin(): boolean {
    return this.userRole === 'SUPER_ADMIN';
  }

  get isAdminOrSuperAdmin(): boolean {
    return this.isAdmin || this.isSuperAdmin;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }
}