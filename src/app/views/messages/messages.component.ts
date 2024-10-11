import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ButtonComponent } from '@shared/button/button.component';
import { CardComponent } from '@shared/card/card.component';
import { CircularContentComponent } from '@shared/circular-content/circular-content.component';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { LogoImageBase64 } from '@constants/logo-base64';
import { MagicLinkListEntity } from '@types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'flw-messages',
  standalone: true,
  imports: [
    PageTitleComponent,
    CardComponent,
    ButtonComponent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIcon,
    CircularContentComponent,
    DatePipe,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  public logoImage: string = LogoImageBase64;
  public events: MagicLinkListEntity[] = [
    {
      id: 1,
      sentReceived: 'Sent',
      createdDate: '2021-09-01T12:00:00Z',
      senderUser: {
        id: 1,
        avatarId: '1',
        title: 'Mr.',
        suffix: 'Jr.',
        firstName: 'Milos',
        lastName: 'Bruka',
        middleName: 'D.',
        email: 'milosbr@gmail.com',
        phoneNumber: '+123456789',
      },
      receiverUser: {
        id: 2,
        avatarId: '2',
        title: 'Mr.',
        suffix: 'Sr.',
        firstName: 'Marko',
        lastName: 'Brankovic',
        middleName: 'M.',
        email: 'markobrankovic@gmail.com',
        phoneNumber: '+123989898',
      },
    },
    {
      id: 2,
      sentReceived: 'Received',
      createdDate: '2021-09-01T12:00:00Z',
      senderUser: {
        id: 1,
        avatarId: '1',
        title: 'Mr.',
        suffix: 'Jr.',
        firstName: 'Milos',
        lastName: 'Bruka',
        middleName: 'D.',
        email: 'milosbr@gmail.com',
        phoneNumber: '+123456789',
      },
      receiverUser: {
        id: 2,
        avatarId: '2',
        title: 'Mr.',
        suffix: 'Sr.',
        firstName: 'Marko',
        lastName: 'Brankovic',
        middleName: 'M.',
        email: 'markobrankovic@gmail.com',
        phoneNumber: '+123989898',
      },
    }
  ];

  public filterEvents(value: string) {
    console.log('filterEvents', value);
  }

  public sortEvents(event: any) {
    console.log('updateEventsSort', event);
  }

  public eventSelected(event: MagicLinkListEntity) {
    console.log('eventSelected', event);
  }
}
