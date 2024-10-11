import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { AppStoreBadgesComponent } from '@shared/app-store-badges/app-store-badges.component';
import { ButtonComponent } from '@shared/button/button.component';
import { CardComponent } from '@shared/card/card.component';
import { CircularContentComponent } from '@shared/circular-content/circular-content.component';
import { ContentHolderComponent } from '@shared/content-holder/content-holder.component';
import { LanguageSelectComponent } from '@shared/language-select/language-select.component';
import { LinkComponent } from '@shared/link/link.component';
import { LogoLinkComponent } from '@shared/logo-link/logo-link.component';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { ProgressBarComponent } from '@shared/progress-bar/progress-bar.component';
import { SideMenuComponent } from '@shared/side-menu/side-menu.component';
import { UsedSpaceComponent } from '@shared/used-space/used-space.component';
import { UserBadgeComponent } from '@shared/user-badge/user-badge.component';
import { UserData, UserFeaturePermission } from '@types';

@Component({
  selector: 'flw-style-guide',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatDivider,
    ContentHolderComponent,
    CircularContentComponent,
    LogoLinkComponent,
    LanguageSelectComponent,
    AppStoreBadgesComponent,
    LinkComponent,
    PageTitleComponent,
    ProgressBarComponent,
    ButtonComponent,
    CardComponent,
    UserBadgeComponent,
    UsedSpaceComponent,
    SideMenuComponent,
  ],
  templateUrl: './style-guide.component.html',
  styleUrl: './style-guide.component.scss',
})
export class StyleGuideComponent {
  user: UserData = {
    email: 'falconUser@icat.solutions',
    createdDate: '2022-02-07T17:13:10',
    updatedDate: '2024-07-13T14:03:31',
    lastLoginDate: '2024-07-13T14:03:31',
    emailVerified: true,
    role: {
      id: 1,
      name: 'User',
    },
    features: [
      {
        feature: 'My Profile',
        permissions: [UserFeaturePermission.Update, UserFeaturePermission.Create, UserFeaturePermission.Read],
      },
    ],
    status: 'Active',
    id: 5,
    firstName: 'Test',
    lastName: 'User',
    workplace: 'iCat Solutions',
    workplaces: [
      {
        id: 5,
        name: 'iCat Solutions',
        isDefault: true,
      },
    ],
    magicLink: 'https://02d5-82-129-49-3.eu.ngrok.io/37UnfVmX',
    isImportEnabled: false,
    showNotifyPatientsFromDownload: false,
    avatarId: 'd2902344-02a1-4082-b657-ac977c8d7113',
  };
}
