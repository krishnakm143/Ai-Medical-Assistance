import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.currentUser$.pipe(
    take(1),
    map(user => {
      // If user is NOT authenticated, allow access to public routes
      if (!user) {
        return true;
      }
      
      // If user is authenticated, redirect to dashboard/home
      router.navigate(['/dashboard']);
      return false;
    })
  );
}; 