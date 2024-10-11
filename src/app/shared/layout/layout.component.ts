import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointService } from '@services/breakpoint.service';
import { LogoLinkComponent } from '../logo-link/logo-link.component';
import { LanguageSelectComponent } from '../language-select/language-select.component';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'flw-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    AsyncPipe,
    LogoLinkComponent,
    LanguageSelectComponent,
    LinkComponent
  ],
})
/**
 * Content projection layout component for the application.
 */
export class LayoutComponent implements AfterViewInit {
  /**
   * The sidenav drawer reference.
   */
  @ViewChild('drawer') sidenavDrawer!: MatDrawer;
  @ViewChild('scrollContainer') scrollContainer!: MatSidenavContent;

  /**
   * An observable indicating whether the view is handset.
   *
   * @returns {Observable<boolean>} An observable that emits a boolean value indicating whether the view is in handset mode.
   * Whenever the value changes, it checks if the sidenav drawer should be closed, based on the handset mode and the drawer's opened state.
   */
  public isHandset$: Observable<boolean> = this.breakpoint.isHandset$.pipe(
    tap((result) => !result && this.sidenavDrawer?.opened && this.sidenavDrawer.close())
  );

  constructor(private breakpoint: BreakpointService, private router: Router) {}

  ngAfterViewInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationSkipped) {
        this.scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
}
