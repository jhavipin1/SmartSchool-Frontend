import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './modules/common/layout/header/header';
import { NavbarComponent } from './modules/common/layout/navbar/navbar';
import { FooterComponent } from './modules/common/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('OnlineExamSystem-Frontend');
  private router = inject(Router);
  isExamMode = false;

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isExamMode = event.urlAfterRedirects.includes('/start-exam');
      });
  }
}