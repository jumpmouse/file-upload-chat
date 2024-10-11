import { Component, Input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'flw-progress-bar',
  standalone: true,
  imports: [MatProgressBar],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input() value: number = 0;
}
