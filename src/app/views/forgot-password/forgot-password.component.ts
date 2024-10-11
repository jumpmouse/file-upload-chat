import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '@shared/button/button.component';
import { LinkComponent } from '@shared/link/link.component';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { NgOtpInputConfig, NgOtpInputModule } from 'ng-otp-input';
import { Observer, of, Subscription } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import { SecurityService } from '@services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { ResetPasswordParams } from '@types';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'flw-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageTitleComponent,
    MatFormField,
    MatInputModule,
    MatError,
    MatProgressSpinner,
    ButtonComponent,
    MatIcon,
    NgOtpInputModule,
    LinkComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  public screenState: 'email-input' | 'verify' | 'done' = 'email-input';
  public sendEmailForm!: FormGroup;
  public resetPasswordForm!: FormGroup;
  public otpInputFormControl: FormControl<string | null> = new FormControl<string | null>(null, [Validators.required]);
  public sendingEmail: boolean = false;
  public resettingPassword: boolean = false;
  public userEmail!: string;
  public readonly otpInputConfig: NgOtpInputConfig = {
    length: 8,
    containerClass: 'flw-otp-input-container',
    inputClass: 'flw-otp-input',
  };

  private subs: { [key: string]: Subscription } = {};

  public get passwordsMatch(): boolean {
    return this.resetPasswordForm.get('password')?.value === this.resetPasswordForm.get('confirmPassword')?.value;
  }

  constructor(
    private navigationService: NavigationService,
    private security: SecurityService,
    private snackbar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sendEmailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
    this.resetPasswordForm = this.formBuilder.group({
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  public goBack() {
    this.navigationService.back();
  }

  public goStateBack() {
    this.sendEmailForm.reset();
    this.screenState = 'email-input';
    this.userEmail = '';
    this.otpInputFormControl.reset();
    this.resetPasswordForm.reset();
  }

  public goToLogin() {
    this.router.navigate(['/', 'login']);
  }

  public sendEmail() {
    if (!this.sendEmailForm.valid || !this.passwordsMatch || this.sendingEmail) {
      this.sendEmailForm.markAllAsTouched();
      return;
    }
    this.sendingEmail = true;
    this.sendEmailForm.disable();

    this.userEmail = this.sendEmailForm.get('email')?.value;
    this.security.sendResetPasswordCode(this.userEmail).subscribe(this.getEmailCodeObserver());
  }

  public resetPassword() {
    if (this.otpInputFormControl.invalid || !this.resetPasswordForm.valid || !this.passwordsMatch || this.resettingPassword) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.resettingPassword = true;
    this.resetPasswordForm.disable();
    this.otpInputFormControl.disable();

    const otpCode = this.otpInputFormControl.value as string;

    const resetPasswordParams: ResetPasswordParams = {
      email: this.userEmail,
      emailCode: otpCode,
      ...this.resetPasswordForm.value,

    };
    this.security.resetPassword(resetPasswordParams).subscribe(this.getResetPasswordObserver());
  }

  private getEmailCodeObserver(): Partial<Observer<any>> {
    return {
      next: () => {
        this.screenState = 'verify';
        this.sendingEmail = false;
        this.sendEmailForm.enable();
        const message = $localize`Verification code sent to your email.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
      },
      error: (err) => {
        this.sendingEmail = false;
        this.sendEmailForm.enable();
        const message = $localize`Sending verification code to email failed. Please, try again.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        return of(err?.error);
      },
    };
  }

  private getResetPasswordObserver(): Partial<Observer<any>> {
    return {
      next: () => {
        this.screenState = 'done';
        this.resettingPassword = false;
        this.resetPasswordForm.enable();
        this.otpInputFormControl.enable();
        const message = $localize`Password successfully updated.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
      },
      error: (err) => {
        this.resettingPassword = false;
        this.resetPasswordForm.enable();
        this.otpInputFormControl.enable();
        const message = $localize`Reset password failed.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        return of(err?.error);
      },
    };
  }
}
