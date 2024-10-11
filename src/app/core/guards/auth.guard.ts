import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  CanActivateFn,
  Router,
} from '@angular/router';
import { UserService } from '@services/user.service';
import { catchError, map, of } from 'rxjs';

// guard for private routes
export const authGuard: CanActivateChildFn = () => {
  const userService = inject(UserService);
  // current user session
  if (userService.userData) return true;
  // no session; check stored token
  const router = inject(Router);
  const navigateHome = () => router.navigate(['/']);
  const loginStatus = userService.testLoginStatus();
  // no token - continue as guest
  if (!loginStatus) {
    navigateHome();
    return false;
  }
  // try to login with stored token (getUserData())
  return loginStatus.pipe(
    map(() => true),
    catchError(() => {
      navigateHome();
      return of(false);
    })
  );
};

// guard for: login, register and forgot password routes
// should be unaccessible if user logged in
export const publicAuthGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  // user logged in - prevent access
  if (userService.userData) return false;
  return true;
};
