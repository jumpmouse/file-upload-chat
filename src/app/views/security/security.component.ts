import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { ButtonComponent } from '@shared/button/button.component';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';
import { SecurityService } from '@services/security.service';
import { UserService } from '@services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'flw-security',
  standalone: true,
  imports: [
    PageTitleComponent,
    MatDivider,
    ButtonComponent,
    MatFormField,
    MatInput,
    MatError,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent implements OnInit {
  @ViewChild('oldPasswordInput') oldPasswordInput!: ElementRef<MatInput>;
  public updatePasswordForm!: FormGroup;
  public loading: boolean = false;

  public get passwordsMatch(): boolean {
    return (
      this.updatePasswordForm.get('newPassword')?.value === this.updatePasswordForm.get('confirmNewPassword')?.value
    );
  }

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.updatePasswordForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [Validators.required]],
    });
  }

  public updatePassword(formDirective: FormGroupDirective) {
    if (!this.updatePasswordForm.valid || !this.passwordsMatch) {
      this.updatePasswordForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const userId = this.userService.userData?.id as number;

    this.securityService.updatePassword(userId, this.updatePasswordForm.value).subscribe({
      next: () => {
        this.loading = false;
        const message = $localize`Password successfully updated`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        this.oldPasswordInput.nativeElement.focus();
        formDirective.resetForm();
        this.updatePasswordForm.reset();
      },
      error: (err) => {
        this.loading = false;
        const { error } = err;
        let message = '';
        if (error?.errorCode === 2001) {
          message = $localize`Your password must be at least 10 characters long, include a number, an uppercase letter and a special character.`;
          const dismiss = $localize`Dismiss`;
          this.snackbar.open(message, dismiss, { duration: 10000, verticalPosition: 'top' });
        } else {
          message = $localize`Password update failed`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        }
      },
    });
  }

  public confirmDeleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDeleteAccountComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const userId = this.userService.userData?.id as number;
      this.userService.deleteAccount(userId).subscribe({
        next: () => {
          const message = $localize`Your account has been deleted.`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
          this.userService.logout();
        },
        error: () => {
          const errorMessage = $localize`Delete account failed.`;
          this.snackbar.open(errorMessage, '', { duration: 3000, verticalPosition: 'top' });
        },
      });
    });
  }
}
