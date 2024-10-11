import { Component, Input } from '@angular/core';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { CardComponent } from '../card/card.component';
import { ButtonComponent } from '../button/button.component';
import { FileSizePipe } from '@pipes/file-size.pipe';

@Component({
  selector: 'flw-used-space',
  standalone: true,
  imports: [CardComponent, ProgressBarComponent, ButtonComponent, FileSizePipe],
  templateUrl: './used-space.component.html',
  styleUrl: './used-space.component.scss'
})
export class UsedSpaceComponent {
  @Input() availableSpace: number = 0;
  @Input() usedSpace: number = 0;
  @Input() asWidget: boolean = false;

  public get value(): number {
    if (!this.availableSpace) return 100;
    return (this.usedSpace / this.availableSpace) * 100;
  }
  public hidePanel: boolean = false;
}
