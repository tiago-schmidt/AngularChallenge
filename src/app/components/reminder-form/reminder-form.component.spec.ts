import { HttpClient, HttpHandler } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { ReminderFormComponent } from './reminder-form.component';

describe('ReminderFormComponent', () => {
  let component: ReminderFormComponent;
  let fixture: ComponentFixture<ReminderFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderFormComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: HttpHandler, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set reminder dateTime to 06/22/2022 18:30', () => {
    component.reminder = {
      id: Date.now(),
      text: undefined,
      color: undefined,
      dateTime: undefined
    };
    component.dateControl = new FormControl('06/22/2022');
    component.time = '18:30';
    component.setReminderDateTime()
    expect(moment(component.reminder.dateTime).format('MM/DD/YYYY HH:mm')).toBe('06/22/2022 18:30');
  });

  it('form should be valid', () => {
    component.reminder = {
      id: Date.now(),
      text: undefined,
      color: undefined,
      dateTime: undefined
    };
    component.dateControl = new FormControl('06/22/2022');
    component.time = '18:30';
    component.reminder.text = 'My Event Test';
    component.reminder.color = 'green';
    expect(component.isFormValid()).toBeTrue();
  });

  it('form should not be valid', () => {
    component.reminder = {
      id: Date.now(),
      text: undefined,
      color: undefined,
      dateTime: undefined
    };
    component.dateControl = new FormControl(null);
    component.time = '18:30';
    component.reminder.text = 'My Event Test';
    expect(component.isFormValid()).toBeFalse();
  });
});
