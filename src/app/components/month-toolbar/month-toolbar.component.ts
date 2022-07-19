import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Moment } from 'moment';

@Component({
  selector: 'app-month-toolbar',
  templateUrl: './month-toolbar.component.html',
  styleUrls: ['./month-toolbar.component.scss']
})
export class MonthToolbarComponent {

  @Input() date: Moment;

  @Output() selectedToday = new EventEmitter<void>();
  @Output() monthChanged = new EventEmitter<void>();

  constructor() { }

  goToToday() {
    this.selectedToday.emit();
  }

  changeMonth(add: boolean) {
    add ? this.date.add(1, 'month') : this.date.subtract(1, 'month');
    this.monthChanged.emit();
  }

}
