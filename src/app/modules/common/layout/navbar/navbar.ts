import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth'; 

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);

  opened = false;
  
  // Observables stream directly to the UI
  isLoggedIn$!: Observable<boolean>;
  username$!: Observable<string | null>;
  currentRoute$!: Observable<string>;

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.username$ = this.authService.fullName$;

    this.currentRoute$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects || event.url),
      startWith(this.router.url)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}