import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { MenuItemRoute, MenuRoutes } from '@constants/menu-routes';
import { LogoImageBase64 } from '@constants/logo-base64';
import { CircularContentComponent } from '../circular-content/circular-content.component';
import { ButtonComponent } from '../button/button.component';
import { UsedSpaceComponent } from '../used-space/used-space.component';
import { MatIcon } from '@angular/material/icon';
import { LinkComponent } from '../link/link.component';
import { UserBadgeComponent } from '../user-badge/user-badge.component';
import { UserService } from '@services/user.service';
import { UserData } from '@types';

@Component({
  selector: 'flw-side-menu',
  standalone: true,
  imports: [
    CircularContentComponent,
    ButtonComponent,
    UsedSpaceComponent,
    ButtonComponent,
    MatIcon,
    LinkComponent,
    UserBadgeComponent,
    AsyncPipe,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent implements OnInit, OnDestroy {
  readonly menuRoutes: MenuItemRoute[] = MenuRoutes;
  userLoggedIn!: Observable<boolean>;
  userData!: UserData | null;
  logoImage: string = LogoImageBase64;

  private subs: {[key: string]: Subscription} = {};

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userLoggedIn = this.userService.isUserLoggedIn$;
    this.subs['userData'] = this.userService.userData$.subscribe(data => (this.userData = data));
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  public navigateTo(path: string[]) {
    this.router.navigate(path);
  }

  public logout() {
    this.userService.logout();
  }
}
