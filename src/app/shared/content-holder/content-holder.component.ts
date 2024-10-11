import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';

/**
 * Content projection component for displaying menu and main content inside responsive grid layout.
 *
 * @remarks
 * This component dynamically adjusts grid parameters based on the screen size:
 * - Desktop: 2 columns
 * - Mobile: 1 column
 *
 * @public
 */
@Component({
  selector: 'flw-content-holder',
  templateUrl: './content-holder.component.html',
  styleUrl: './content-holder.component.scss',
  standalone: true,
  imports: [CardComponent],
})
export class ContentHolderComponent {}
