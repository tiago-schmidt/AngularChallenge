import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMaskModule } from 'ngx-mask'

const MATERIAL_MODULES = [
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatToolbarModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    ...MATERIAL_MODULES,
  ],
  exports: [
    NgxMaskModule,
    ...MATERIAL_MODULES,
  ]
})
export class SharedModule { }
