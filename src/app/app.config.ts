import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, BaseRouteReuseStrategy, withPreloading, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { Injectable } from '@angular/core';

@Injectable()
export class NoRouteReuse extends BaseRouteReuseStrategy {
  override shouldReuseRoute = () => false;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload'}), withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: NoRouteReuse }
  ],
};
