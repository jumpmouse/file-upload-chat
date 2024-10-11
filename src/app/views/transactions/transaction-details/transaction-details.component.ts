import { DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ButtonComponent } from '@shared/button/button.component';
import { CardComponent } from '@shared/card/card.component';
import { MagicLinkDetails, MagicLinkListEntity, MagicLinkListUser, TransactionDetails } from '@types';
import { FileSizePipe } from '@pipes/file-size.pipe';
import { formatDistance, compareAsc } from 'date-fns';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmDeleteFileComponent } from '../confirm-delete-file/confirm-delete-file.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'flw-transaction-details',
  standalone: true,
  imports: [
    ButtonComponent,
    MatButtonToggle,
    MatButtonToggleGroup,
    CardComponent,
    MatTabGroup,
    MatTab,
    DatePipe,
    FileSizePipe,
    MatIcon,
  ],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.scss',
})
export class TransactionDetailsComponent implements OnChanges {
  @Input() transaction!: TransactionDetails;
  @Output() goToTransactions: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteFile: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('DefaultTab') detailsTab!: MatButtonToggle;

  public doctorInfo!: MagicLinkListUser | null;
  public doctorName: string = '';
  public selectedTab: number = 0;
  public expiresIn!: string;
  public transactionExpired: boolean = true;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.transaction && changes.transaction.firstChange) return;
    const transaction: MagicLinkListEntity | MagicLinkDetails = changes.transaction.currentValue;
    if (!transaction) return;

    this.doctorInfo = this.setDoctorInfo(transaction);
    if (this.doctorInfo) this.doctorName = this.setDoctorName(this.doctorInfo);
    if (transaction.expireDate) {
      const dateNowUTC = new Date().toISOString();
      this.expiresIn = formatDistance(transaction.expireDate, dateNowUTC, { addSuffix: true });
      this.transactionExpired = compareAsc(dateNowUTC, transaction.expireDate) === 1;
    }
  }

  public goBack() {
    this.goToTransactions.emit();
    this.doctorInfo = null;
    this.doctorName = '';
    this.selectedTab = 0;
    this.expiresIn = '';
    this.transactionExpired = true;
    this.detailsTab.checked = true;
  }

  public changeTab(tabName: MatButtonToggleChange) {
    this.selectedTab = tabName.value === 'details' ? 0 : 1;
  }

  public confirmDeleteFile() {
    const dialogRef = this.dialog.open(ConfirmDeleteFileComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const patientSharedStudyId = this.transaction?.id;
      this.deleteFile.emit(patientSharedStudyId);
      
    });
  }

  private setDoctorInfo(transaction: TransactionDetails): MagicLinkListUser | null {
    if (!transaction) return null;
    return (
      transaction.sentReceived === 'Sent' ? transaction.receiverUser : transaction.senderUser
    ) as MagicLinkListUser;
  }

  private setDoctorName(doctorInfo: MagicLinkListUser): string {
    if (!doctorInfo) return '';
    let doctorName = '';
    if (doctorInfo.firstName || doctorInfo.lastName) {
      doctorName = `${doctorInfo.suffix || doctorInfo.title || ''} ${doctorInfo.firstName || ''} ${doctorInfo.lastName || ''}`;
    } else if (doctorInfo.email) {
      doctorName = `${doctorInfo.email}`;
    }
    return doctorName;
  }
}
