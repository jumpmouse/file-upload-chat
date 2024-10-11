import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { SelectOption } from '@types';

@Component({
  selector: 'flw-select',
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SelectComponent {
  @Input() value!: string;
  @Input() options: SelectOption[] = [];
  @Input() disabled: boolean = false;
  @Input() subscriptSizing: 'dynamic' | 'fixed' = 'dynamic';
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

  selectionChanged(event: MatSelectChange) {
    this.onChange.emit(event.value);
  }
}
