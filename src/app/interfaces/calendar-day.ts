import { Reminder } from "./reminder";

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  weekend: boolean;
  isCurrentMonth: boolean;
  reminders?: Reminder[];
}
