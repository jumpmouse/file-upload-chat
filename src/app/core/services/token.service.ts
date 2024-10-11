import { Injectable } from '@angular/core';
import { LoginResponse } from '@types';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private _token: string = '';

  public get hasToken(): boolean {
    return this.getToken() ? true : false;
  }
  public get hasStoredUserString(): boolean {
    return window.localStorage.getItem('userId') ? true : false;
  }

  public setToken(loginResponse: LoginResponse) {
    this._token = loginResponse.bearer;
    const userString = this.prepareUserString(loginResponse);
    window.localStorage.setItem('userId', userString);
  }

  public getToken(): string {
    // current session; token in memory
    if (this._token) return this._token;
    // no session; check if user has token stored
    else if (window.localStorage.getItem('userId'))
      return this.restoreTokenFromLoginResponse(window.localStorage.getItem('userId') as string);
    // no token
    else return '';
  }

  public removeToken() {
    window.localStorage.removeItem('userId');
    this._token = '';
  }

  public getUserIdFromLoginResponse(): number | undefined {
    const userString = (window.localStorage.getItem('userId') as string) || '';
    let loginResponseString = '';

    try {
      loginResponseString = atob(userString);
      const loginResponse: LoginResponse = JSON.parse(loginResponseString);

      if (loginResponse && typeof loginResponse === 'object') return loginResponse.userId;
      else return undefined;
    }
    catch (error) {
      return undefined;
    }
  }

  private restoreTokenFromLoginResponse(userString: string): string {
    let loginResponseString = '';
    try {
      loginResponseString = atob(userString);
      const loginResponse: LoginResponse = JSON.parse(loginResponseString);

      if (loginResponse && typeof loginResponse === 'object') return loginResponse.bearer;
      else return '';
    }
    catch (error) {
      return '';
    }
  }

  private prepareUserString(loginResponse: LoginResponse): string {
    const userString = JSON.stringify(loginResponse);
    return btoa(userString);
  }
}
