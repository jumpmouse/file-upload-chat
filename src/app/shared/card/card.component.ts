import { Component, Input, input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'flw-card',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatCardFooter],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() type:  'default' | 'info' | 'menu-panel' | 'content-panel' | 'table' | 'message' | 'message-events' | 'used-space' = 'default';
}
