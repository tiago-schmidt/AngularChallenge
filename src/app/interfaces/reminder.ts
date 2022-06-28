import { Weather } from "./wheater";

export interface Reminder {
  id: number;
  text: string;
  dateTime: Date;
  color: string;
  city?: string;
  weather?: Weather;
  isHidden?: boolean;
}
