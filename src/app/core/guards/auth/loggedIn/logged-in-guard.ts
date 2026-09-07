import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth.service';

export const loggedInGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const isAuthenticated = await authService.checkAuth();

    if (isAuthenticated) {
      return router.createUrlTree(['/dashboard']);
    }

    return true;
};
