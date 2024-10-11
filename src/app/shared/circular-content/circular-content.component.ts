import { NgIf, UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'flw-circular-content',
  standalone: true,
  imports: [UpperCasePipe, MatIcon],
  templateUrl: './circular-content.component.html',
  styleUrl: './circular-content.component.scss'
})
export class CircularContentComponent {
@Input() type: 'image' | 'text' = 'text';
@Input() size: 'small' | 'medium' | 'large' = 'medium';
@Input() withBackground: boolean = false;
@Input() blockElement: boolean = false;
@Input() mobileAdjust: boolean = false;
@Input() content: string = 'FL';
}
