import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'flw-confirm-delete-file',
  standalone: true,
  imports: [ MatIcon, MatDialogTitle, MatDialogActions, MatDialogContent, ButtonComponent],
  templateUrl: './confirm-delete-file.component.html',
  styleUrl: './confirm-delete-file.component.scss'
})
export class ConfirmDeleteFileComponent {
  constructor(private dialog: MatDialogRef<ConfirmDeleteFileComponent>) {}

  deleteFile() {
    this.dialog.close(true);
  }

  closeDialog() {
    this.dialog.close(false);
  }
}
