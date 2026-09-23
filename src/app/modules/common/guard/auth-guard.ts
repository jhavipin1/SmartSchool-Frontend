import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../common/services/auth';

export const AuthGuard: CanActivateFn = (route): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Step 1: Check login status
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // Step 2: Role check
  const expectedRoles: string[] = route.data['roles'] || [];
  const userRole = authService.getUserRole() || '';

  if (expectedRoles.length > 0 && !expectedRoles.includes(userRole)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};