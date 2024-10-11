import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'flw-link',
  standalone: true,
  imports: [MatButton, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkComponent {
  @Input() route: string[] | undefined;
  @Input() href: string = '';
  @Input() theme: 'blue' | 'gray' | 'darkgray' | 'white' | 'red' | 'inherit' | 'none' = 'none';
  @Input() underline: boolean = false;
  @Input() bold: boolean = false;
  @Input() menuLink: boolean = false;
  @Output() linkClicked: EventEmitter<undefined> = new EventEmitter<undefined>();

  public onLinkClick(event: Event): void {
    event.preventDefault();
    this.linkClicked.emit();
  }
}
