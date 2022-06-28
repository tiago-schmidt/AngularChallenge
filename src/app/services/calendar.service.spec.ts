import { TestBed } from '@angular/core/testing';
import { Reminder } from '../interfaces/reminder';

import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a reminder with city', () => {
    const reminder: Reminder = {
      id: Date.now(),
      color: '#fff',
      text: 'My Test Event',
      dateTime: new Date(),
      city: 'Atlanta'
    }
    service.create(reminder);
    expect(service.reminders).toContain(reminder);
  });
});
