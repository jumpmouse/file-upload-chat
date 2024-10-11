import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);
  private breakpointHeadset: string = '(max-width: 1024.98px)';
  private breakpointMobile: string = '(max-width: 600.98px)';
  private breakpointTablet: string = '(min-width: 601px) and (max-width: 1024.98px)';
  private breakpointSmallDesktop: string = '(min-width: 1025px) and (max-width: 1400.98px)';
  private breakpointDesktop: string = '(min-width: 1401px)';
  private breakpointDesktopHd: string = '(min-width: 1560px)';
  private breakpointDesktopQhd: string = '(min-width: 2200px)';
  private breakpointLargeDesktop: string = '(min-width: 2600px)';
  private breakpointDesktopUhd: string = '(min-width: 3120px)';
  private breakpoints: {[key: string]: string} = {
    headset: this.breakpointHeadset,
    mobile: this.breakpointMobile,
    tablet: this.breakpointTablet,
    smallDesktop: this.breakpointSmallDesktop,
    desktop: this.breakpointDesktop,
    hd: this.breakpointDesktopHd,
    qhd: this.breakpointDesktopQhd,
    largeDesktop: this.breakpointLargeDesktop,
    uhd: this.breakpointDesktopUhd,
  }

  public get isHandset$(): Observable<boolean> {
    return this.checkBreakpoint(this.breakpointHeadset).pipe(shareReplay());
  }

  public get isUhd$(): Observable<boolean> {
    return this.checkBreakpoint(this.breakpointDesktopUhd).pipe(shareReplay());
  }

  public getBreakpoints(...args: string[]): Observable<{[key: string]: boolean}> {
    const breakpointValues: string[] = args.map((breakpoint: string) => this.breakpoints[breakpoint]);
    return this.breakpointObserver.observe(breakpointValues)
    .pipe(
      map((result) => {
        let breakpointObject: {[key: string]: boolean} = {};
        for (let i = 0; i < args.length; i++) {
          const breakpoint = args[i];
          breakpointObject[breakpoint] = result.breakpoints[this.breakpoints[breakpoint]];
        }
        return breakpointObject;
      },
      shareReplay()
    ));
  }

  private checkBreakpoint(breakpoint: string): Observable<boolean> {
    return this.breakpointObserver
    .observe([breakpoint])
    .pipe(map((result) => result.matches));
  }
}
