import { Reminder } from "./reminder";

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isWeekend: boolean;
  isCurrentMonth: boolean;
  reminders: Reminder[];
}
