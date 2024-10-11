import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { MatDivider } from '@angular/material/divider';
import { ButtonComponent } from '@shared/button/button.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SecurityService } from '@services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationService } from '@services/navigation.service';
import { Observer, of, Subscription } from 'rxjs';
import { NgOtpInputModule, NgOtpInputConfig } from 'ng-otp-input';
import { LinkComponent } from '@shared/link/link.component';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'flw-register',
  standalone: true,
  imports: [
    PageTitleComponent,
    MatDivider,
    ButtonComponent,
    MatFormField,
    MatInput,
    MatError,
    MatHint,
    MatProgressSpinner,
    ReactiveFormsModule,
    NgOtpInputModule,
    LinkComponent,
    MatIcon,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  public registerForm!: FormGroup;
  public registrationState: 'register' | 'verify' | 'done' = 'register';
  public registering: boolean = false;
  public verifying: boolean = false;
  public otpInputFormControl: FormControl<string | null> = new FormControl<string | null>(null, [Validators.required]);
  public userEmail!: string;
  public readonly otpInputConfig: NgOtpInputConfig = {
    length: 8,
    containerClass: 'flw-otp-input-container',
    inputClass: 'flw-otp-input',
  };

  private subs: { [key: string]: Subscription } = {};

  public get passwordsMatch(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private snackbar: MatSnackBar,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required, Validators.pattern('^[- +0-9]+$')]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  public registerUser() {
    if (!this.registerForm.valid || !this.passwordsMatch || this.registering) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.registerForm.disable();
    this.registering = true;
    this.userEmail = this.registerForm.get('email')?.value;
    
    this.securityService.registerUser(this.registerForm.value).subscribe({
      next: () => {
        this.registrationState = 'verify';
        this.registering = false;
        this.registerForm.enable();
        this.sendEmailCode();
      },
      error: (err) => {
        let message = '';
        const { error } = err;
        if (error?.errorCode === 3005) {
          message = $localize`Oops! The mobile number you entered is not valid. Please include your country code and follow this format: +[Country Code]-[Mobile Number] (e.g. +1-XXX-XXX-XXXX)`;
          this.snackbar.open(message, '', { duration: 5000, verticalPosition: 'top' });
        } else if (error?.errorCode === 2001) {
          message = $localize`Your password must be at least 10 characters long, include a number, an uppercase letter and a special character.`;
          this.snackbar.open(message, '', { duration: 5000, verticalPosition: 'top' });
        } else if (error?.errorCode === 2007) {
          this.registrationState = 'verify';
          message = $localize`Email registration initiated earlier. Proceed to verify your email.`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        } else if (error?.errorCode === 2005 || error?.errorCode === 2008) {
          message = $localize`User already exists.`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        } else {
          message = $localize`Registration failed`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        }
        this.registering = false;
        this.registerForm.enable();
      },
    });
  }

  public verifyEmailCode() {
    if (this.otpInputFormControl.invalid || !this.userEmail) return;
    this.otpInputFormControl.disable();
    this.verifying = true;
    this.subs['verifyEmailCode'] = this.securityService
      .verifyEmailConfirmationCode(this.userEmail, this.otpInputFormControl.value as string)
      .subscribe(this.getVerifyEmailCodeObserver());
  }

  public goBack() {
    this.navigationService.back();
  }

  public goStateBack() {
    this.registrationState = 'register';
    this.userEmail = '';
    this.otpInputFormControl.reset();
  }

  public goToLogin() {
    this.router.navigate(['/', 'login']);
  }

  public sendEmailCode() {
    this.subs['sendEmailCode'] = this.securityService.sendEmailCode(this.userEmail).subscribe(this.getEmailCodeObserver());
  }

  private getEmailCodeObserver(): Partial<Observer<any>> {
    return {
      next: () => {
        const message = $localize`Verification code sent to your email.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
      },
      error: (err) => {
        const { error } = err;
        let message = '';
        if (error?.errorCode === 4003) {
          const dismiss = $localize`Dismiss`;
          message = $localize`Email code verification limit reached. Please try again in 12 hours.`;
          this.snackbar.open(message, dismiss, { duration: 10000, verticalPosition: 'top' });
        } else {
          message = $localize`Sending verification code to email failed. Please, try again.`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        }
        return of(err?.error);
      },
    };
  }

  private getVerifyEmailCodeObserver(): Partial<Observer<any>> {
    return {
      next: () => {
        this.verifying = false;
        this.otpInputFormControl.enable();
        this.registrationState = 'done';
      },
      error: (err) => {
        this.verifying = false;
        this.otpInputFormControl.enable();
        const { error } = err;
        let message = '';
        if (error?.errorCode === 4003) {
          const dismiss = $localize`Dismiss`;
          message = $localize`Email code verification limit reached. Please try again in 12 hours.`;
          this.snackbar.open(message, dismiss, { duration: 10000, verticalPosition: 'top' });
        } else if (error?.errorCode === 4002) {
          const dismiss = $localize`Dismiss`;
          message = $localize`Email verification code has expired. Please resend code and try again.`;
          this.snackbar.open(message, dismiss, { duration: 10000, verticalPosition: 'top' });
        } else {
          message = $localize`Verifying code failed.`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        }
        return of(err?.error);
      },
    };
  }
}
