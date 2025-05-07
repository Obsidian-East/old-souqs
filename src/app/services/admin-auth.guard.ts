import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
   //  SSR-safe check
   if (typeof window === 'undefined' || !window.localStorage) {
    router.navigate(['/login-admin']);
    return false;
  }
  const isAdminLoggedIn = localStorage.getItem('admin-token');

  if (!isAdminLoggedIn || isAdminLoggedIn !== 'true') {
    router.navigate(['/login-admin']);
    return false;
  }

  return true;
};
