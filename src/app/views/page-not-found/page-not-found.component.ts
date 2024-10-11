import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'flw-page-not-found',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

  constructor(private router: Router) {}
  
  public goHome() {
    this.router.navigate(['/']);
  }
}
