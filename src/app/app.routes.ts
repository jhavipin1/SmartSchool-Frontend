import { Routes } from '@angular/router';
import { AuthGuard } from './modules/common/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/identity/pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./modules/identity/pages/signup/signup').then((m) => m.SignupComponent),
  },

  // --- PROTECTED DASHBOARD WRAPPER ---
  {
    path: 'dashboard',
    
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./modules/common/component/profile/profile').then(
            (m) => m.ProfileComponent,
          ),
        canActivate: [AuthGuard],
        data: { roles: ['USER'] },
      },
          
      
      {
        path: 'forgotpassword',
        loadComponent: () =>
          import(
            './modules/identity/pages/forgot-password/forgot-password'
          ).then((m) => m.ForgotPassword),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
    ],
  },

  // --- GLOBAL ROUTES ---
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./modules/common/component/unauthorized/unauthorized').then(
        (m) => m.UnauthorizedComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];