import { inject } from '@angular/core';
import { Route, Router, UrlSegment } from '@angular/router';

import { AuthService } from '../../authentication/auth.service';

export const authGuard = (route: Route, path: UrlSegment[]) => { 
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthorized = !!authService.getAccess();

  if (isAuthorized) return true;
  else {
    authService.redirectUrl = `/${path.toString().replace(',', '/')}`;
    return router.createUrlTree(['/account/login']);
  }
};
