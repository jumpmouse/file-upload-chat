import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { SenderDetailsForm, MagicLinkInfo, UserData } from '@types';
import { FileSizePipe } from '@pipes/file-size.pipe';
import { Observable, Observer, of, Subscription } from 'rxjs';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ButtonComponent } from '@shared/button/button.component';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { NgOtpInputModule, NgOtpInputConfig } from 'ng-otp-input';
import { LinkComponent } from '@shared/link/link.component';
import { MagicLinkService } from '@services/magic-link.service';
import { MatIcon } from '@angular/material/icon';
import { CardComponent } from '@shared/card/card.component';
import { Router } from '@angular/router';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { BreakpointService } from '@services/breakpoint.service';

@Component({
  selector: 'flw-home-upload',
  standalone: true,
  imports: [
    PageTitleComponent,
    FileSizePipe,
    JsonPipe,
    ButtonComponent,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatHint,
    AsyncPipe,
    NgOtpInputModule,
    LinkComponent,
    MatIcon,
    CardComponent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
  templateUrl: './home-upload.component.html',
  styleUrl: './home-upload.component.scss',
})
export class HomeUploadComponent implements OnDestroy {
  @Input() doctorInfo: MagicLinkInfo | null = null;
  @Input() userLoggedIn$!: Observable<boolean>;
  @Input() userData!: UserData | null;
  @Output() sendFiles: EventEmitter<SenderDetailsForm> = new EventEmitter();

  @ViewChild('DragDropContainer') dropContainer!: ElementRef;

  public files: File[] = [];
  public senderDetailsForm!: FormGroup;
  public screenState: 'sender-details' | 'verify' = 'sender-details';
  public userVerified: boolean = false;
  public senderEmail!: string;
  public showCreateAccountPopup: boolean = false;
  public otpInputFormControl: FormControl<string | null> = new FormControl<string | null>(null, [Validators.required]);
  public readonly otpInputConfig: NgOtpInputConfig = {
    length: 8,
    containerClass: 'flw-otp-input-container',
    inputClass: 'flw-otp-input',
  };
  public patientNamePlaceholder: string = '';
  public verifying: boolean = false;
  public showFileList: boolean = false;
  public dropLoading: boolean = false;
  public textAreaRows: number = 3;
  public isUhdResolution!: boolean;
  public limitReached: boolean = false;

  private otpCode: string = '';
  private subs: {[key: string]: Subscription} = {};

  constructor(
    private formBuilder: FormBuilder,
    private magicLinkService: MagicLinkService,
    private snackbar: MatSnackBar,
    private router: Router,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit() {
    const lastName = this.userData?.lastName ? ` ${this.userData?.lastName}` : '';
    const patientName = `${this.userData?.firstName || ''}${lastName}`;

    this.senderDetailsForm = this.formBuilder.group({
      PatientName: [patientName || '', [Validators.required]],
      Email: [this.userData?.email || '', [Validators.required, Validators.email]],
      PhoneNumber: [this.userData?.phoneNumber || '', [Validators.pattern('^[- +0-9]+$')]],
      Message: [''],
    });

    if (this.userData) {
      this.senderDetailsForm.controls.Email.disable();
      this.senderDetailsForm.controls.PhoneNumber.disable();
    }

    this.subs['breakpoints'] = this.breakpointService.isUhd$.subscribe((isUhd: boolean) => {
      this.isUhdResolution = isUhd;
      this.textAreaRows = isUhd ? 5 : 3;
    });
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  public prepareDataForUpload() {
    // user logged in
    if (this.userData) {
      this.zipAndSendFiles();
      return;
    }
    // public user - verified email
    if (this.userVerified) {
      this.zipAndSendFiles(true);
      return;
    }
    // not verified
    this.senderEmail = this.senderDetailsForm.getRawValue().Email;
    this.screenState = 'verify';
    this.sendEmailCode();
  }

  public selectFiles(event: Event) {
    const isFileListWithFiles = (event.target as HTMLInputElement)?.files?.length;
    const files = isFileListWithFiles ? Array.from((event.target as HTMLInputElement).files as ArrayLike<File>) : [];
    this.files = this.files.concat(files);
    if (this.files.length) this.showFileList = true;
  }

  public sendEmailCode() {
    this.limitReached = false;
    this.magicLinkService.sendVerificationCode(this.senderEmail).subscribe(this.getEmailCodeObserver());
  }

  public verifyEmailCode() {
    if (this.otpInputFormControl.invalid) return;
    this.otpInputFormControl.disable();
    this.verifying = true;
    const otpCode = this.otpInputFormControl.value as string;
    this.magicLinkService
      .verifyEmailCode(this.senderEmail, otpCode)
      .subscribe(this.getVerifyEmailCodeObserver(otpCode));
  }

  public goStateBack() {
    this.screenState = 'sender-details';
    this.senderEmail = '';
    this.otpInputFormControl.reset();
  }

  public goToSignIn() {
    this.router.navigate(['/', 'register']);
  }

  public async onFileDrop(event: DragEvent) {
    this.dropLoading = true;
    this.preventDefault(event);
    this.dropContainer.nativeElement.classList.remove('flw-file-enter');
    
    const items = event.dataTransfer?.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry() as FileSystemEntry;
      if (item.isFile) {
        await (item as FileSystemFileEntry).file((file: File) => {
          this.files.push(file);
        });
      } else if (item.isDirectory) {
        await this.readDirs(item as FileSystemEntry);
      }
    }
    setTimeout(() => {
      if (this.files.length) {
        this.showFileList = true;
        this.dropLoading = false;
      }
    }, 1000);
  }

  public onFileEnter(event: DragEvent) {
    this.preventDefault(event);
    this.dropContainer.nativeElement.classList.add('flw-file-enter');
  }

  public onFileLeave(event: DragEvent) {
    this.preventDefault(event);
    this.dropContainer.nativeElement.classList.remove('flw-file-enter');
  }

  public preventDefault(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  public removeFileFromList(fileName: string) {
    for (let index = 0; index < this.files.length; index++) {
      if (this.files[index].name === fileName) {
        this.files.splice(index, 1);
        break;
      }
    }
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
          this.limitReached = true;
        } else {
          message = $localize`Sending verification code to email failed. Please, try again.`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        }
        return of(err?.error);
      },
    };
  }

  private getVerifyEmailCodeObserver(otpCode: string): Partial<Observer<any>> {
    return {
      next: () => {
        this.verifying = false;
        this.otpInputFormControl.enable();
        this.otpCode = otpCode;
        this.userVerified = true;
        const message = $localize`Email successfully verified.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        this.prepareDataForUpload();
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

  private zipAndSendFiles(withOtp?: boolean) {
    let senderDetails: SenderDetailsForm = { files: this.files, ...this.senderDetailsForm.getRawValue() };
    if (withOtp) senderDetails['OTP'] = this.otpCode;
    this.sendFiles.emit(senderDetails);
  }

  private async readDirs(item: FileSystemEntry) {
    if (item.isDirectory) {
      let directoryReader = (item as FileSystemDirectoryEntry).createReader();
      const readEntries = () => {
        directoryReader.readEntries((entries: any) => {
          if (entries.length) {
            entries.forEach((entry: any) => {
              this.readDirs(entry);
            });
            readEntries();
          }
        });
      };
      readEntries();
    } else if (item.isFile) {
      await (item as FileSystemFileEntry).file((file: File) => {
        this.files.push(file);
      });
    }
  }
}
