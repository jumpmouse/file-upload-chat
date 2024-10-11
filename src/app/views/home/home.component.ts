import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { MagicLinkInfo, MagicLinkList, SenderDetailsForm, UserData } from '@types';
import { AsyncPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MagicLinkService } from '@services/magic-link.service';
import { HomeInfoComponent } from './home-info/home-info.component';
import { HomeUploadComponent } from './home-upload/home-upload.component';
import { HomeProgressComponent } from './home-progress/home-progress.component';

type HomeScreenState = 'info' | 'upload' | 'progress' | 'done';

@Component({
  selector: 'flw-home',
  standalone: true,
  imports: [
    AsyncPipe,
    HomeInfoComponent,
    HomeUploadComponent,
    HomeProgressComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  public userLoggedIn$!: Observable<boolean>;
  public userData$!: Observable<UserData | null>;
  public recentlySentData$!: Observable<MagicLinkList | null>;
  public doctorInfo: MagicLinkInfo | null = null;
  public userData!: UserData | null;
  public senderDetails!: SenderDetailsForm;

  public homeScreenState$: BehaviorSubject<HomeScreenState> = new BehaviorSubject<HomeScreenState>('info');

  public magicLink: string = '';
  private subs: { [key: string]: Subscription } = {};

  constructor(
    private userService: UserService,
    private snackbar: MatSnackBar,
    private magicLinkService: MagicLinkService
  ) {}

  ngOnInit() {
    this.userLoggedIn$ = this.userService.isUserLoggedIn$;
    this.userData$ = this.userService.userData$.pipe(tap((userData) => (this.userData = userData)));
    this.recentlySentData$ = this.magicLinkService.getRecentlySentData();
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  public getDoctorInfo(falconLinkControl: FormControl<string | null>) {
    this.magicLink = this.prepareMagicLink(falconLinkControl.value as string);
    this.magicLinkService.getDoctorInfo(this.magicLink).subscribe({
      next: (data) => {
        this.doctorInfo = data;
        this.homeScreenState$.next('upload');
      },
      error: (err) => {
        const message = $localize`Oh no! The link appears to be incorrect. Please verify the Falcon Link you entered and try again.`;
        const dismiss = $localize`Dismiss`;
        this.snackbar.open(message, dismiss, {duration: 10000, verticalPosition: 'top'});
      }
    });
  }

  public setFileList(senderDetails: SenderDetailsForm) {
    this.senderDetails = senderDetails;
    this.homeScreenState$.next('progress');
  }

  public resetTransfer() {
    this.homeScreenState$.next('upload');
  }

  private prepareMagicLink(link: string): string {
    const linkArray = link.split('/');
    return linkArray[linkArray.length - 1];
  }
}
