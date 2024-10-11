import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ButtonComponent } from '@shared/button/button.component';
import { Observable } from 'rxjs';
import { MagicLinkList, UserData } from '@types';
import { RecentSentTableComponent } from './recent-sent-table/recent-sent-table.component';

@Component({
  selector: 'flw-home-info',
  standalone: true,
  imports: [
    PageTitleComponent,
    AsyncPipe,
    MatFormField,
    MatInput,
    MatError,
    ReactiveFormsModule,
    ButtonComponent,
    MatHint,
    RecentSentTableComponent
  ],
  templateUrl: './home-info.component.html',
  styleUrl: './home-info.component.scss',
})
export class HomeInfoComponent {
  @Input() userLoggedIn$!: Observable<boolean>;
  @Input() userData$!: Observable<UserData | null>;
  @Input() recentlySentData$!: Observable<MagicLinkList | null>;
  @Output() sendMagicLink: EventEmitter<FormControl<string | null>> = new EventEmitter<FormControl<string | null>>();

  public falconLinkControl: FormControl<string | null> = new FormControl<string | null>(null);

  public getDoctorInfo() {
    this.sendMagicLink.emit(this.falconLinkControl);
  }

  public applyRecentMagicLink(magicLink: string) {
    this.falconLinkControl.setValue(magicLink);
    this.getDoctorInfo();
  }
}
