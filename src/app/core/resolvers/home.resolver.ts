import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '@services/user.service';
import { finalize, Observable } from 'rxjs';

export const homeResolver: ResolveFn<boolean> = (route, state) => {
  const userService = inject(UserService);
  // current user session
  if (userService.userData) return true;
  // no session; check if user has token stored
  const loginStatus: false | Observable<boolean> = userService.testLoginStatus();
  // invalid/no token - continue as guest
  if (!loginStatus) return true;
  // try to login with stored token (getUserData())
  return loginStatus.pipe(finalize(() => true));
};
