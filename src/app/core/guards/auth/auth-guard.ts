import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await authService.checkAuth();
  if(isAuthenticated){
    return true;
  }

  return router.createUrlTree(['/login']);
};
