import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginParams, LoginResponse, UserData, ResetPasswordParams, SaveProfileParams } from '@types';
import { HttpClient } from '@angular/common/http';
import { HttpMethod, DataUtilsService } from './utils';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private http: HttpClient, private dataUtils: DataUtilsService) {}

  login(loginParams: LoginParams): Observable<LoginResponse> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'login');
    return this.http.post<LoginResponse>(url, loginParams, this.dataUtils.getHttpOptions());
  }

  logout(): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'logout');
    return this.http.post(url, null, this.dataUtils.getHttpOptions());
  }

  userData(userId: number): Observable<UserData> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.GET, 'userData', userId.toString());
    return this.http.get<UserData>(url, this.dataUtils.getHttpOptions());
  }

  saveUserProfile(userId: number, saveProfileParams: SaveProfileParams): Observable<UserData> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.PUT, 'saveProfile', userId.toString());
    return this.http.put<UserData>(url, saveProfileParams, this.dataUtils.getHttpOptions());
  }

  deleteUser(userId: number): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.DELETE, 'deleteUser', userId.toString());
    return this.http.delete(url, this.dataUtils.getHttpOptions());
  }
}
