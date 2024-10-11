import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'flw-confirm-delete-account',
  standalone: true,
  imports: [ MatIcon, MatDialogTitle, MatDialogActions, MatDialogContent, ButtonComponent],
  templateUrl: './confirm-delete-account.component.html',
  styleUrl: './confirm-delete-account.component.scss'
})
export class ConfirmDeleteAccountComponent {
  constructor(private dialog: MatDialogRef<ConfirmDeleteAccountComponent>) {}

  deleteAccount() {
    this.dialog.close(true);
  }

  closeDialog() {
    this.dialog.close(false);
  }
}
