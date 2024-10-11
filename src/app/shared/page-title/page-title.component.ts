import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'flw-page-title',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss'
})
export class PageTitleComponent {
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() type: 'title' | 'withSubtitle' | 'text' = 'title';
  @Input() color: 'gray' | 'darkgray' | 'inherit' = 'inherit';
}
