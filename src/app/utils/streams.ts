import { of } from "rxjs";

export const COLORS = of([
  { name: 'Task', value: '#90A955' },
  { name: 'Event', value: '#508991' },
  { name: 'Work', value: '#E4572E' },
  { name: 'Entertainment', value: '#D56AA0' }
] as const);

export const WEEK_DAYS = of([
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const);
