import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { LinkComponent } from '@shared/link/link.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '@shared/button/button.component';
import { PageTitleComponent } from '@shared/page-title/page-title.component';

@Component({
  selector: 'flw-login',
  standalone: true,
  imports: [
    PageTitleComponent,
    ButtonComponent,
    MatFormField,
    MatInput,
    MatError,
    ReactiveFormsModule,
    LinkComponent,
    MatProgressSpinner,
    AsyncPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public loading$!: Observable<boolean>;
  public loginError$!: Observable<number | null>;
  public errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.resetLoginError();
    this.loginForm = this.formBuilder.group({
      login: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });

    this.loading$ = this.userService.loginLoading$;
    this.loginError$ = this.userService.isLoginError$.pipe(tap((errorCode) => {
      this.errorMessage = errorCode === 2007 ? $localize`This email hasn't been verified yet.` : $localize`Invalid email or password`;
    }));
  }

  public login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched()
      return;
    }
    this.userService.login(this.loginForm.value);
  }

  public goHome() {
    this.router.navigate(['/']);
  }
}
