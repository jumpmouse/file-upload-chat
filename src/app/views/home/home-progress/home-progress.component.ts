import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MagicLinkInfo, SenderDetails, SenderDetailsForm, SenderDetailsOTP } from '@types';
import JSZip from 'jszip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { FileSizePipe } from '@pipes/file-size.pipe';
import { ButtonComponent } from '@shared/button/button.component';
import { Observable, Subscription, Observer, of, timer } from 'rxjs';
import { MagicLinkService } from '@services/magic-link.service';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelTransferComponent } from './confirm-cancel-transfer/confirm-cancel-transfer.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BreakpointService } from '@services/breakpoint.service';

@Component({
  selector: 'flw-home-progress',
  standalone: true,
  imports: [MatProgressSpinner, PageTitleComponent, FileSizePipe, ButtonComponent, MatIcon],
  templateUrl: './home-progress.component.html',
  styleUrl: './home-progress.component.scss',
})
export class HomeProgressComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() senderDetailsForm!: SenderDetailsForm;
  @Input() doctorInfo!: MagicLinkInfo | null;
  @Input() magicLink!: string;
  @Output() transferCanceled: EventEmitter<any> = new EventEmitter();

  public progress: number = 0;
  public state: 'pack-files' | 'transfer-files' | 'transfer-error' | 'done' = 'pack-files';
  public progressDiameter!: number;
  public progressStrokeWidth!: number;

  private zipFile!: JSZip | null;
  private subs: { [key: string]: Subscription } = {};
  private filesZipped: boolean = false;
  private preparedFile!: File;
  private preparedSenderDetails!: SenderDetails | SenderDetailsOTP;
  private readonly progressSpinnerDimensions = {
    diameter: { default: 235, qhd: 310, uhd: 365 },
    strokeWidth: { default: 18, qhd:26, uhd: 30 }
  }

  constructor(
    private magicLinkService: MagicLinkService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private router: Router,
    private breakpointService: BreakpointService,
  ) {}

  ngOnInit(): void {
    this.subs['breakpoints'] = this.breakpointService.getBreakpoints('qhd', 'uhd').subscribe(({ qhd, uhd }: {[key: string]: boolean}) => {
      if (uhd) {
        this.progressDiameter = this.progressSpinnerDimensions.diameter['uhd'];
        this.progressStrokeWidth = this.progressSpinnerDimensions.strokeWidth['uhd'];
      } else if (qhd) {
        this.progressDiameter = this.progressSpinnerDimensions.diameter['qhd'];
        this.progressStrokeWidth = this.progressSpinnerDimensions.strokeWidth['qhd'];
      } else {
        this.progressDiameter = this.progressSpinnerDimensions.diameter['default'];
        this.progressStrokeWidth = this.progressSpinnerDimensions.strokeWidth['default'];
      }
    });
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.zipFile = this.zipFiles(this.senderDetailsForm?.files);

    if (this.zipFile) {
      this.zipFile
        .generateAsync(
          {
            type: 'blob',
            streamFiles: true,
            compression: 'DEFLATE',
            compressionOptions: {
              level: 3,
            },
          },
          (data) => {
            if (this.filesZipped) return;

            this.filesZipped = this.progress === 100;
            this.progress = Math.round(data.percent);
            this.cd.detectChanges();
          }
        )
        .then((blob) => {
          timer(2000).subscribe(() => {
            this.state = 'transfer-files';
            this.subs['uploadFile'] = this.uploadFile(blob).subscribe(this.getUploadFileObserver());
          });
        });
    }
  }

  public cancelTransfer(skipDialog?: boolean) {
    if (skipDialog) {
      this.subs['uploadFile']?.unsubscribe();
      const message = $localize`Transfer canceled`;
      this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
      this.transferCanceled.emit();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmCancelTransferComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.subs['uploadFile']?.unsubscribe();
      this.transferCanceled.emit();
    });
  }

  public retryTransfer() {
    this.state = 'transfer-files';
    this.subs['uploadFile'] = this.magicLinkService
      .uploadFiles(this.preparedSenderDetails)
      .subscribe(this.getUploadFileObserver());
  }

  public goToHome() {
    this.router.navigate(['/']);
  }

  private zipFiles(files: File[]): JSZip | null {
    if (!files?.length) return null;
    const zipFile: JSZip = new JSZip();
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      zipFile.file(file.name, file);
    }
    return zipFile;
  }

  private uploadFile(zipFile: Blob): Observable<any> {
    this.progress = 0;
    this.preparedFile = new File([zipFile], 'falconlink-files.zip', { type: 'application/zip' });

    this.preparedSenderDetails = {
      ...this.senderDetailsForm,
      MagicLink: this.magicLink,
      IsSharingOwnData: true,
      NumberOfFiles: 1,
      files: this.preparedFile,
    };

    return this.magicLinkService.uploadFiles(this.preparedSenderDetails);
  }

  private getUploadFileObserver(): Partial<Observer<any>> {
    return {
      next: (event) => {
        if (!event?.type) return;
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
            break;
          case HttpEventType.Response:
            this.progress = 100;
            this.state = 'done';
            break;
        }
      },
      error: (err) => {
        this.state = 'transfer-error';
        const message = $localize`File Upload failed. Please try again.`;
        this.snackbar.open(message, '', { duration: 5000, verticalPosition: 'top' });
        return of(err?.error);
      },
      complete: () => {
        this.state = 'done';
      }
    };
  }
}
