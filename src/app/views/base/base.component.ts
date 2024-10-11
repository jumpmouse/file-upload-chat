import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@environment';
import { AppStoreBadgesComponent } from '@shared/app-store-badges/app-store-badges.component';
import { CardComponent } from '@shared/card/card.component';
import { ContentHolderComponent } from '@shared/content-holder/content-holder.component';
import { LayoutComponent } from '@shared/layout/layout.component';
import { SideMenuComponent } from '@shared/side-menu/side-menu.component';

@Component({
  selector: 'flw-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LayoutComponent,
    ContentHolderComponent,
    CardComponent,
    SideMenuComponent,
    AppStoreBadgesComponent,
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss',
})
export class BaseComponent {
  public environment = environment;
}
