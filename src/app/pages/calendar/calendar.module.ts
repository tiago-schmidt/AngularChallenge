import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReminderFormModule } from 'src/app/components/reminder-form/reminder-form.module';

@NgModule({
  declarations: [
    CalendarComponent
  ],
  exports: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    ReminderFormModule,
  ],
})
export class CalendarModule { }
