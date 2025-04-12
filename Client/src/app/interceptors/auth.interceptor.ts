import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { switchMap, take } from 'rxjs/operators';
import { from, lastValueFrom } from 'rxjs';
import { auth } from '../firebase.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  
  // Skip adding token for public endpoints
  if (req.url.includes('/auth') || req.url.includes('/public')) {
    return next(req);
  }

  return userService.currentUser$.pipe(
    take(1),
    switchMap(async (user) => {
      if (!user) {
        return next(req);
      }

      try {
        // Get the token from Firebase
        const token = await auth.currentUser?.getIdToken();
        
        if (!token) {
          return next(req);
        }

        // Clone the request and add the authorization header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next(authReq);
      } catch (error) {
        console.error('Error getting auth token', error);
        return next(req);
      }
    }),
    switchMap(result => from(result))
  );
}; 