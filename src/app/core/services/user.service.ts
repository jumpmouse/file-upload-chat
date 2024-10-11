import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, switchMap, tap, catchError, map, BehaviorSubject, filter } from 'rxjs';
import { UAParser } from 'ua-parser-js';
import { LoginParams, LoginResponse, SaveProfileParams, UserData, UserDevice } from '@types';
import { UserDataService } from './data/user-data.service';
import { TokenService } from './token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userData$: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  private _isLoginError$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private _loginLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get isUserLoggedIn$(): Observable<boolean> {
    return this._isUserLoggedIn$.asObservable();
  }

  public get userData(): UserData | null {
    return this._userData$.value;
  }

  public get userData$(): Observable<UserData> {
    return this._userData$.asObservable().pipe(filter(val => val !== null)) as Observable<UserData>;
  }

  public get isLoginError$(): Observable<number | null> {
    return this._isLoginError$.asObservable();
  }

  public get loginLoading$(): Observable<boolean> {
    return this._loginLoading$.asObservable();
  }

  constructor(private router: Router, private userDataService: UserDataService, private tokenService: TokenService, private snackbar: MatSnackBar) {}

  /**
   * Performs a login operation by sending login parameters to userDataService.login.
   * It then handles the response by setting the token, fetching user data, and updating login status.
   * If successful, it navigates to the home page
   *
   * @param {LoginParams} loginParams - The parameters for the login operation.
   * @return {void}
   */
  public login(params: LoginParams) {
    this._loginLoading$.next(true);
    this._isLoginError$.next(null);

    const { browser, device, os } = UAParser();
    const deviceParams: UserDevice = {
      type: device.type,
      model: device.model,
      systemName: os.name,
      systemVersion: os.version,
      clientVersion: browser.version,
    };
    const loginParams = Object.assign({}, params, {
      deviceType: device.type,
      device: deviceParams,
    });

    this.userDataService
      .login(loginParams)
      .pipe(
        tap((loginData: LoginResponse) => {
          this.tokenService.setToken(loginData);
        }),
        switchMap((loginData: LoginResponse) => {
          return this.getAndSetUserData(loginData.userId);
        })
      )
      .subscribe({
        next: () => {
          this.setLoginStatus(true);
          this._loginLoading$.next(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          const { error } = err;
          this._loginLoading$.next(false);
          this._isLoginError$.next(error?.errorCode || null);
        },
      });
  }

  public logout() {
    this.userDataService.logout().subscribe({
      complete: () => {
        this.setLoginStatus(false);
        this.clearUserData();
        this.router.navigate(['/']);
      },
    });
  }

  /**
   * Function to test the login status.
   *
   * @return {false | Observable<boolean>} Returns false if token is not stored/invalid, Otherwise. gets UserData and sets login status. returns an observable with status.
   */
  public testLoginStatus(): false | Observable<boolean> {
    if (!this.tokenService.hasStoredUserString) return false;

    const userId = this.tokenService.getUserIdFromLoginResponse();
    if (userId === undefined) {
      this.clearUserData();
      return false;
    }
    return this.getAndSetUserData(userId).pipe(
      // token valid
      tap(() => this.setLoginStatus(true)),
      map(() => true),
      // token expired
      catchError((error) => {
        this.clearUserData();
        return of(false);
      })
    );
  }

  public saveProfile(userId: number, profileParams: SaveProfileParams): Observable<UserData> {
    return this.userDataService.saveUserProfile(userId, profileParams).pipe(tap((userData) => {
      this._userData$.next(userData);
    }));
  }

  public deleteAccount(userId: number): Observable<any> {
    return this.userDataService.deleteUser(userId);
  }

  public resetLoginError() {
    this._isLoginError$.next(null);
  }

  private setLoginStatus(status: boolean) {
    this._isUserLoggedIn$.next(status);
  }

  private clearUserData() {
    this.tokenService.removeToken();
    this._userData$.next(null);
  }

  private getAndSetUserData(userId: number): Observable<UserData> {
    return this.userDataService.userData(userId).pipe(tap((userData) => this._userData$.next(userData)));
  }
}
