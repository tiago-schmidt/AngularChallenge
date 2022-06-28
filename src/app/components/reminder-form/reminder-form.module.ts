import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReminderFormComponent } from './reminder-form.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  declarations: [
    ReminderFormComponent
  ],
  exports: [
    ReminderFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ReminderFormModule { }
