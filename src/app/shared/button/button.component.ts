import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'flw-button',
  standalone: true,
  imports: [MatButton, MatIconButton, MatFabButton, MatIcon, NgTemplateOutlet],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() size: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' = 'small';
  @Input() flavor: 'iconBackground' | 'iconOutlined' | 'iconTransparent' | 'textTransparent' | 'iconText' =
    'iconText';
  @Input() theme: 'blue' | 'red' | 'gray' | 'white' | 'gray-inverted' | 'soft-gray' = 'white';
  @Input() icon!: string;
  @Input() bold: boolean = false;
  @Input() weightMedium: boolean = false;
  @Input() wide: boolean = false;
  @Input() disabled: boolean = false;
  @Output() buttonClicked = new EventEmitter<undefined>();
}
