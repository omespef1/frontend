import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let requestToForward = req;
  const mockUser = authService.currentMockUser();
  
  let headers = req.headers;
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  if (mockUser) {
    headers = headers.set('X-Mock-User', mockUser);
  }
  
  if (token || mockUser) {
    requestToForward = req.clone({ headers });
  }
  
  return next(requestToForward).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        // Attempt to refresh token
        return authService.refresh().pipe(
          switchMap((newToken) => {
            const retriedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken.token}`
              }
            });
            return next(retriedReq);
          }),
          catchError((refreshErr) => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
