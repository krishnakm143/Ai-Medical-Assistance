import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.currentUser$.pipe(
    take(1),
    map(user => {
      // If user is authenticated, allow access
      if (user) {
        return true;
      }
      
      // If user is not authenticated, redirect to auth page
      router.navigate(['/auth'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    })
  );
}; 