import { Injectable } from '@angular/core';
import { filter, from, Observable, toArray } from 'rxjs';

import { Reminder } from '../interfaces/reminder';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  reminders: Reminder[] = [];

  constructor() { }

  create(data: Reminder): Reminder {
    this.reminders.push({
      id: Date.now(),
      ...data
    });
    return data;
  }

  edit(data: Reminder, updated: Reminder): Reminder {
    const i = this.reminders.indexOf(data);
    this.reminders.splice(i, 1, updated); // just swapping the updated with the "old", simulating a PUT
    return data;
  }

  list(date: Date): Observable<Reminder[]> {
    const month = date.getMonth();
    return from(this.reminders)
      .pipe(
        filter(r => r.dateTime.getMonth() == month),
        toArray()
      );
  }

  delete(reminderId: number) {
    this.reminders = this.reminders.filter(r => r.id !== reminderId);
  }
}
