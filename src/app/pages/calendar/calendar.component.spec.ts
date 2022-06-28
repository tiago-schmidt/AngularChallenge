import { HttpClient, HttpHandler } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CalendarDay } from 'src/app/interfaces/calendar-day';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DATE_PATTERN, DATE_TIME_PATTERN, FIRST_DAY } from 'src/app/utils/consts';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarComponent ],
      imports: [
        MatDialogModule,
        SharedModule
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
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a calendar with 5 rows', () => {
    component.calendarDays = [];
    component.currentDate = moment('06152022', DATE_PATTERN);
    component.currentMonth = component.currentDate.month();
    component.currentYear = component.currentDate.year();

    component.currentMonthFirstDay = moment(component.currentDate).date(FIRST_DAY);
    component.currentMonthLastDay = moment(component.currentDate).date(component.currentDate.daysInMonth());

    const currentMonthWeeks = (component.currentMonthLastDay.week() - component.currentMonthFirstDay.week());
    component.shouldHaveSixRows = currentMonthWeeks == 5;

    component.pastMonthLastDay = moment(component.currentDate).subtract(1, 'month').daysInMonth();
    expect(component.getDaysInMonth()).toHaveSize(35); // 7 days x 5 rows
  });

  it('should create a calendar with 6 rows', () => {
    component.calendarDays = [];
    component.currentDate = moment('07152022', DATE_PATTERN);
    component.currentMonth = component.currentDate.month();
    component.currentYear = component.currentDate.year();

    component.currentMonthFirstDay = moment(component.currentDate).date(FIRST_DAY);
    component.currentMonthLastDay = moment(component.currentDate).date(component.currentDate.daysInMonth());

    const currentMonthWeeks = (component.currentMonthLastDay.week() - component.currentMonthFirstDay.week());
    component.shouldHaveSixRows = currentMonthWeeks == 5;

    component.pastMonthLastDay = moment(component.currentDate).subtract(1, 'month').daysInMonth();
    expect(component.getDaysInMonth()).toHaveSize(42); // 7 days x 6 rows
  });

  it('should have 3 reminder for the day 06/13/2022', () => {
    component.reminders = [
      {
        id: 1,
        text: 'Test',
        color: '#90A955',
        dateTime: moment('0613202218:30', DATE_TIME_PATTERN).toDate(),
        city: 'New York',
        weather: {
          main: "Clear",
          icon: "01d"
        }
      },
      {
        id: 12,
        text: 'Test with maximum length of 30',
        color: '#508991',
        dateTime: moment('0624202218:30', DATE_TIME_PATTERN).toDate(),
        city: 'Egypt',
        weather: {
          main: "Clouds",
          icon: "01d"
        }
      },
      {
        id: 123,
        text: 'Test',
        color: '#E4572E',
        dateTime: moment('0613202218:30', DATE_TIME_PATTERN).toDate(),
      },
      {
        id: 1234,
        text: 'Test',
        color: '#D56AA0',
        dateTime: moment('0615202218:30', DATE_TIME_PATTERN).toDate(),
      },
      {
        id: 12345,
        text: 'Test',
        color: '#508991',
        dateTime: moment('0620202218:30', DATE_TIME_PATTERN).toDate(),
        city: 'Criciúma',
        weather: {
          main: "Rain",
          icon: "10d"
        }
      },
      {
        id: 123456,
        text: 'Test',
        color: '#E4572E',
        dateTime: moment('0620202218:30', DATE_TIME_PATTERN).toDate(),
        city: 'Hong Kong',
        weather: {
          main: "Clear",
          icon: "01d"
        }
      },
      {
        id: 1234567,
        text: 'Test',
        color: '#508991',
        dateTime: moment('0613202218:30', DATE_TIME_PATTERN).toDate(),
      },
      {
        id: 12345678,
        text: 'Test',
        color: '#D56AA0',
        dateTime: moment('0620202218:30', DATE_TIME_PATTERN).toDate(),
        city: 'New York',
        weather: {
          main: "Rain",
          icon: "10d"
        }
      },
    ];
    const calendarDay: CalendarDay = {
      day: 13,
      month: 5,
      year: 2022,
      isCurrentMonth: true,
      weekend: false
    }
    expect(component.getCalendarDayReminders(calendarDay)).toHaveSize(3);
  });
});
