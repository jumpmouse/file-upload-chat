import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { BreakpointService } from '@services/breakpoint.service';
import { UserService } from '@services/user.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { MagicLinkLimit, UserData } from '@types';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDivider } from '@angular/material/divider';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { ButtonComponent } from '@shared/button/button.component';
import { CircularContentComponent } from '@shared/circular-content/circular-content.component';
import { UsedSpaceComponent } from '@shared/used-space/used-space.component';
import { MagicLinkService } from '@services/magic-link.service';

@Component({
  selector: 'flw-profile',
  standalone: true,
  imports: [
    PageTitleComponent,
    ButtonComponent,
    MatFormField,
    MatInput,
    MatError,
    MatHint,
    ReactiveFormsModule,
    CircularContentComponent,
    MatProgressSpinner,
    MatDivider,
    UsedSpaceComponent,
  ],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  public profileForm!: FormGroup;
  public loading: boolean = false;
  public userData!: UserData;
  public initials: string = '';
  public availableSpace!: number;
  public usedSpace!: number;
  public isUhd!: boolean;

  private subs: { [key: string]: Subscription } = {};

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private magicLinkService: MagicLinkService,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar,
    private breakpointService: BreakpointService,
  ) {}

  ngOnInit() {
    this.userData = this.userService.userData as UserData;
    this.subs['userLimit'] = this.magicLinkService.getMagicLinkLimit().subscribe(({usedDataInKb, limitInKb}: MagicLinkLimit) => {
      this.availableSpace = limitInKb;
      this.usedSpace = usedDataInKb;
    });
    this.initials = (this.userData.firstName?.charAt(0) + this.userData.lastName?.charAt(0)) || '';
    this.profileForm = this.formBuilder.group({
      firstName: [this.userData.firstName],
      lastName: [this.userData.lastName],
      phoneNumber: [this.userData.phoneNumber, [Validators.pattern('^[- +0-9]+$')]],
    });
    this.subs['breakpoints'] =  this.breakpointService.isUhd$.subscribe((isUhd: boolean) => this.isUhd = isUhd);

  }

  ngAfterViewInit(): void {
    this.subs['userData'] = this.userService.userData$.subscribe((data) => {
      this.userData = data;
      this.initials = (this.userData.firstName?.charAt(0) + this.userData.lastName?.charAt(0)) || '';
    });
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  public copyMagicLink(magicLink: string) {
    const copyStatus = this.clipboard.copy(magicLink);
    const copyMessage = $localize`Link copied to clipboard`;
    const copyFailedMessage = $localize`Failed to copy link`;
    const message = copyStatus ? copyMessage : copyFailedMessage;
    this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
  }

  public saveProfile() {
    if (
      !this.profileForm.valid ||
      (!this.profileForm.controls.firstName.touched &&
        !this.profileForm.controls.lastName.touched &&
        !this.profileForm.controls.phoneNumber.touched)
    ) {
      return;
    }
    this.loading = true;
    this.userService.saveProfile(this.userData.id, this.profileForm.value).subscribe({
      next: () => {
        this.loading = false;
        const message = $localize`Profile updated`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
      },
      error: (err) => {
        this.loading = false;
        const { error } = err;
        let message = '';
        if (error?.errorCode === 3005) {
          message = $localize`Oops! The mobile number you entered is not valid. Please include your country code and follow this format: +[Country Code]-[Mobile Number] (e.g. +1-XXX-XXX-XXXX)`;
          const dismiss = $localize`Dismiss`;
          this.snackbar.open(message, dismiss, { duration: 10000, verticalPosition: 'top' });
        } else {
          message = $localize`Profile update failed`;
          this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
        }
      },
    });
  }
}
