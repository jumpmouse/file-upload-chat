import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpMethod, DataUtilsService } from './utils';
import {RegistrationParams, UpdatePasswordParams, ResetPasswordParams} from '@types';

@Injectable({
  providedIn: 'root',
})
export class SecurityDataService {
  constructor(private http: HttpClient, private dataUtils: DataUtilsService) {}

  verifyPasswordConfirmationCode(email: string, emailCode: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'verifyPasswordConfirmationCode');
    return this.http.post(url, { email, emailCode }, this.dataUtils.getHttpOptions());
  }

  updatePassword(userId: number, updatePasswordParams: UpdatePasswordParams): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'updatePassword', userId.toString());
    return this.http.post(url, updatePasswordParams, this.dataUtils.getHttpOptions());
  }

  registerUser(registrationParams: RegistrationParams): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'registerUser');
    return this.http.post(url, registrationParams, this.dataUtils.getHttpOptions());
  }

  sendEmailCode(email: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'sendEmailCode');
    return this.http.post(url, {email}, this.dataUtils.getHttpOptions());
  }

  verifyEmailConfirmationCode(email: string, emailCode: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'verifyEmailConfirmationCode');
    return this.http.post(url, {email, emailCode}, this.dataUtils.getHttpOptions());
  }

  sendResetPasswordCode(email: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'sendResetPasswordCode');
    return this.http.post(url, {email}, this.dataUtils.getHttpOptions());
  }

  resetPassword(resetPasswordParams: ResetPasswordParams): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'resetPassword');
    return this.http.post(url, resetPasswordParams, this.dataUtils.getHttpOptions());
  }
}
