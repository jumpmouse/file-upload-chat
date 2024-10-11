import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'flw-confirm-cancel-transfer',
  standalone: true,
  imports: [ MatIcon, MatDialogTitle, MatDialogActions, MatDialogContent, ButtonComponent],
  templateUrl: './confirm-cancel-transfer.component.html',
  styleUrl: './confirm-cancel-transfer.component.scss'
})
export class ConfirmCancelTransferComponent {
  constructor(private dialog: MatDialogRef<ConfirmCancelTransferComponent>) {}

  cancelTransfer() {
    this.dialog.close(true);
  }

  closeDialog() {
    this.dialog.close(false);
  }
}
