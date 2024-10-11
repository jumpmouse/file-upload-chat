import { Injectable } from '@angular/core';
import { SecurityDataService } from './data/security-data.service';
import { RegistrationParams, ResetPasswordParams, UpdatePasswordParams } from '@types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor(private securityDataService: SecurityDataService) {}

  public updatePassword(userId: number, updatePasswordParams: UpdatePasswordParams): Observable<any> {
    return this.securityDataService.updatePassword(userId, updatePasswordParams);
  }

  public registerUser(registrationParams: RegistrationParams): Observable<any> {
    return this.securityDataService.registerUser(registrationParams);
  }

  public sendEmailCode(email: string): Observable<any> {
    return this.securityDataService.sendEmailCode(email);
  }

  public verifyEmailConfirmationCode(email: string, code: string): Observable<any> {
    return this.securityDataService.verifyEmailConfirmationCode(email, code);
  }

  public sendResetPasswordCode(email: string): Observable<any> {
    return this.securityDataService.sendResetPasswordCode(email);
  }

  public resetPassword(resetPasswordParams: ResetPasswordParams): Observable<any> {
    return this.securityDataService.resetPassword(resetPasswordParams);
  }
}
