import { Component } from '@angular/core';
import { CircularContentComponent } from '../circular-content/circular-content.component';
import { LogoImageBase64 } from '@constants/logo-base64';
import { Router } from '@angular/router';

@Component({
  selector: 'flw-logo-link',
  standalone: true,
  imports: [CircularContentComponent],
  templateUrl: './logo-link.component.html',
  styleUrl: './logo-link.component.scss'
})
export class LogoLinkComponent {
  public logoImage: string = LogoImageBase64;

  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
