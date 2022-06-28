import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { WeatherService } from 'src/app/services/weather.service';
import { ReminderFormComponent } from 'src/app/components/reminder-form/reminder-form.component';
import { HelperMethods } from 'src/app/utils/helper-methods';
import { CalendarDay } from 'src/app/interfaces/calendar-day';
import { MONTHS } from 'src/app/utils/lists';
import {
  WEEK, DATE_PATTERN, DELETE_ERROR, FIRST_DAY, SUCCESS_DELETE, ABSOLUTE_CLASS,
  CONTAINER_ID, SHOW_MORE_BTN_ID, CLOSE_BTN_ID, INVISIBLE_CLASS, BG_LIGHT_GRAY_CLASS,
  ABSOLUTE_HEADER_CLASS, CLOSE_EXPANDED_INFO
} from 'src/app/utils/consts';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  currentDate: moment.Moment;
  currentMonth: number;
  currentYear: number;
  currentMonthFirstDay: moment.Moment;
  currentMonthLastDay: moment.Moment;
  pastMonthLastDay: number;
  calendarDays: CalendarDay[];
  shouldHaveSixRows: boolean = false;

  onDestroy$ = new Subject<boolean>();

  reminders: Reminder[] = [];
  months: readonly string[] = MONTHS;

  hiddenRemindersMap: Map<string, string[]> = new Map();

  constructor(
    private calendarService: CalendarService,
    private weatherService: WeatherService,
    private matDialog: MatDialog,
    private helper: HelperMethods,
  ) { }

  ngOnInit(): void {
    this.setCalendarData();
  }

  setCalendarData(current?: moment.Moment) {
    this.currentDate = current ? current : moment();
    this.currentMonth = this.currentDate.month();
    this.currentYear = this.currentDate.year();

    this.currentMonthFirstDay = moment(this.currentDate).date(FIRST_DAY);
    this.currentMonthLastDay = moment(this.currentDate).date(this.currentDate.daysInMonth());
    const currentMonthWeeks = (this.currentMonthLastDay.week() - this.currentMonthFirstDay.week());
    // if current month has five weeks should render one extra grid row
    this.shouldHaveSixRows = currentMonthWeeks == 5;

    this.pastMonthLastDay = moment(this.currentDate).subtract(1, 'month').daysInMonth();
    this.calendarDays = this.getDaysInMonth();

    this.getReminders();
  }

  private getReminders() {
    this.calendarService.list(this.currentDate.toDate())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((reminders: Reminder[]) => {
        this.reminders = reminders;
      });
  }

  getWeather(city: string) {
    this.weatherService.getWeatherInformation(city).subscribe({
      next: (result) => {
        return result;
      },
      error: (exception) => {
        this.helper.handleError(exception);
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  resetHiddenReminders() {
    setTimeout(() => { this.hiddenRemindersMap = new Map() }, 0);
  }

  openReminderForm(reminder?: Reminder) {
    if(this.checkThereIsOneExpanded()) {
      // this if check is a workaround
      // TODO: fix this as soon as there is time available
      this.helper.showInfo(CLOSE_EXPANDED_INFO);
      return;
    }

    const dialogRef = this.matDialog.open(ReminderFormComponent, {
      width: '45%',
      data: {
        ...reminder,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      if(!result.isUpdate)
        this.calendarService.create(result.reminder);
      else
        this.calendarService.edit(reminder, result.reminder);

      this.getReminders();
    });
  }

  getCalendarDayReminders(calendarDay: CalendarDay) {
    const calendarDate = this.getShortDate(calendarDay);
    return this.reminders.filter(r => {
      return calendarDate === moment(r.dateTime).format(DATE_PATTERN)
    });
  }

  getDaysInMonth() {
    let calendarDays: CalendarDay[] = [];

    // ex: pastMonthLastDay is 31
    // and currentMonthFirstDay starts at day 3 (Wed)
    // so pastMonthFirstDayInCalendar should be 29 (Sun)
    const pastMonthFirstDayInCalendar = this.pastMonthLastDay - (this.currentMonthFirstDay.day() - 1);

    for(let i = pastMonthFirstDayInCalendar; i <= this.pastMonthLastDay; i++) {
      calendarDays.push(this.newCalendarDay(i, calendarDays.length + 1, false));
    }
    // adding current month days to calendar
    for(let i = 1; i <= this.currentDate.daysInMonth(); i++) {
      calendarDays.push(this.newCalendarDay(i, calendarDays.length + 1));
    }
    // adding remaining days to calendar
    const calendarCells = (this.shouldHaveSixRows ? 6 : 5) * WEEK;
    for(let i = 1; calendarDays.length < calendarCells; i++) {
      calendarDays.push(this.newCalendarDay(i, calendarDays.length + 1, false));
    }
    return calendarDays;
  }

  newCalendarDay(day: number, days: number, isCurrentMonth: boolean = true): CalendarDay {
    return {
      day,
      month: isCurrentMonth ? this.currentMonth : this.currentMonth + 1,
      year: this.currentYear,
      weekend: this.checkWeekend(days),
      isCurrentMonth,
      reminders: []
    }
  }

  checkWeekend(days: number) {
    // it's weekend at first position then at every 7th and 8th day
    return days == 1 || days % 7 == 0 || (days - 1) % 7 == 0;
  }

  getCalendarDayClass(calendarDay: CalendarDay) {
    const isToday = this.getShortDate(calendarDay) === this.currentDate.format(DATE_PATTERN);
    const today = isToday && calendarDay.isCurrentMonth ? 'today' : '';
    return `${today} ${calendarDay.weekend ? 'weekend' : 'bg-white'}`;
  }

  getShortDate(date: CalendarDay) {
    const { month, day, year } = date;
    // ex: to render month and day as 08 or 04
    return `${month < 10 ? '0' : ''}${month + 1}${day < 10 ? '0' : ''}${day}${year}`;
  }

  delete(event: MouseEvent, reminderId: number) {
    event.stopImmediatePropagation();

    const deleted = this.calendarService.delete(reminderId);
    if(deleted) {
      this.helper.showSuccess(SUCCESS_DELETE);
      this.getReminders();
    } else {
      this.helper.showError(DELETE_ERROR);
    }
  }

  goToToday() {
    this.setCalendarData();
  }

  nextMonth() {
    this.currentDate.add(1, 'month');
    this.setCalendarData(this.currentDate);
    this.resetHiddenReminders();
  }

  previousMonth() {
    this.currentDate.subtract(1, 'month');
    this.setCalendarData(this.currentDate);
    this.resetHiddenReminders();
  }

  getCalendarDayId(calendarDay: CalendarDay) {
    return `${calendarDay.day}${calendarDay.month}`;
  }

  shouldHide(calendarDay: CalendarDay, reminder: Reminder) {
    const calendarDayId = this.getCalendarDayId(calendarDay);
    const reminderId = `${reminder.id}`;
    const dayEl = document.getElementById(calendarDayId);
    const reminderEl = document.getElementById(reminderId);
    if(!dayEl || !reminderEl) return;

    const positionDiff = dayEl.getBoundingClientRect().bottom - reminderEl.getBoundingClientRect().bottom;
    // check if there is no space between the bottom of the element and the bottom of the parent div
    const shouldHide = positionDiff < 0;

    const mapValues = this.hiddenRemindersMap.get(calendarDayId);
    if(shouldHide && (!mapValues || !mapValues.includes(reminderId))) {
      reminder.isHidden = true;
      this.setHiddenRemindersMap(calendarDayId, reminderId);
    }
    else {
      reminder.isHidden = false;
    }
    return shouldHide;
  }

  getHiddenRemindersMap(key: string) {
    const mapValues = this.hiddenRemindersMap.get(key);
    return mapValues ? mapValues.length : mapValues;
  }

  setHiddenRemindersMap(calendarDayId: string, reminderId: string) {
    let mapValue = this.hiddenRemindersMap.get(calendarDayId);
    mapValue = mapValue ? [...mapValue, reminderId] : [reminderId];
    this.hiddenRemindersMap.set(calendarDayId, mapValue);
  }

  collapseOrExpandReminders(calendarDay: CalendarDay, event: MouseEvent) {
    // using timeout so angular can rerender changes
    setTimeout(() => event.stopImmediatePropagation(), 0);

    const containerId = CONTAINER_ID + this.getCalendarDayId(calendarDay);
    if(this.checkThereIsOneExpanded(containerId)) {
      // this if check is a workaround
      // TODO: fix this as soon as there is time available
      this.helper.showInfo(CLOSE_EXPANDED_INFO);
      return;
    }

    // set expanded class on the clicked element and change the buttons
    const dayEl = document.getElementById(containerId);
    const showMoreEl = document.getElementById(SHOW_MORE_BTN_ID + this.getCalendarDayId(calendarDay));
    const closeBtnEl = document.getElementById(CLOSE_BTN_ID + this.getCalendarDayId(calendarDay));

    dayEl.classList.toggle(ABSOLUTE_CLASS);
    showMoreEl.classList.toggle(INVISIBLE_CLASS);
    closeBtnEl.classList.toggle(INVISIBLE_CLASS);
    showMoreEl.parentElement.classList.toggle(BG_LIGHT_GRAY_CLASS);
    showMoreEl.parentElement.parentElement.classList.toggle(ABSOLUTE_HEADER_CLASS);

    // show invisible reminders
    calendarDay.reminders.forEach(r => {
      if(r.isHidden) {
        const reminderEl = document.getElementById(`${r.id}`);
        reminderEl.classList.toggle('invisible');
      }
    });
  }

  checkThereIsOneExpanded(containerId?: string) {
    const el = document.getElementsByClassName(ABSOLUTE_CLASS);
    return el.length > 0 && el.item(1) && containerId != el.item(1).id;
  }

}
