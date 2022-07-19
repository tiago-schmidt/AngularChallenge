import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MonthToolbarComponent } from './month-toolbar.component';

@NgModule({
  declarations: [
    MonthToolbarComponent
  ],
  exports: [
    MonthToolbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class MonthToolbarModule { }
