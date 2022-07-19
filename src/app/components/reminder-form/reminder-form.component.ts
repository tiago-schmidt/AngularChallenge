import { AfterContentInit, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Reminder } from 'src/app/interfaces/reminder';
import { WeatherService } from 'src/app/services/weather.service';
import { CITY_NOT_FOUND, DATE_TIME_PATTERN, FULL_TIME, INVALID_FORM_MSG, NOT_FOUND, OPEN_WHEATER_ICON_URL, REQUIRED_FIELD_MSG, SUCCESS_SAVE } from 'src/app/utils/consts';
import { HelperMethods } from 'src/app/utils/helper-methods';
import { COLORS } from 'src/app/utils/streams';
import { TimeMaskPipe } from 'src/app/utils/masks/time-mask.pipe';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent implements AfterContentInit {

  dateControl: FormControl;

  time: string = '';
  timeMask: TimeMaskPipe = new TimeMaskPipe();

  colors$: Observable<readonly any[]> = COLORS;

  requiredFieldMessage: string = REQUIRED_FIELD_MSG;

  isUpdate: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public reminder: Reminder,
    public dialogRef: MatDialogRef<ReminderFormComponent>,
    private helper: HelperMethods,
    private weatherService: WeatherService,
  ) { }

  ngAfterContentInit() {
    this.dateControl = new FormControl(null, this.helper.dateValidator);

    const { dateTime } = this.reminder;
    if(dateTime) {
      this.isUpdate = true;
      const dateArr = dateTime.toLocaleDateString().split('/');
      this.dateControl.setValue(dateArr.map(v => v.length < 2 ? `0${v}` : v).join(''));
      this.time = dateTime.toTimeString().substring(0,5);
    }
  }

  close() {
    this.dialogRef.close();
  }

  setTimeMask(value: string) {
    this.time = this.timeMask.transform(value);
  }

  getDateError() {
    const { errors } = this.dateControl;
    return errors
      ? errors.invalidDate
        ? errors.invalidDate
        : this.requiredFieldMessage
      : null;
  }

  isFormValid() {
    const { value: date } = this.dateControl;
    const { text, color } = this.reminder;

    const someValueMissing = !this.helper.isAllPresent(this.time, date, text, color);
    const hasError = this.dateControl.errors || this.time.length < FULL_TIME;

    const valid = !someValueMissing && !hasError;
    return valid;
  }

  create() {
    if(!this.isFormValid()) {
      this.helper.showError(INVALID_FORM_MSG);
      return;
    }
    if(this.reminder.city) {
      this.weatherService.getWeatherInformation(this.reminder.city).subscribe({
        next: (result: any) => {
          this.reminder.weather = {
            ...result.weather[0]
          };
          this.save();
        },
        error: (exception: any) => {
          if(exception.error.cod == NOT_FOUND)
            this.helper.showError(CITY_NOT_FOUND);
          else
            this.helper.handleError(exception);
        }
      })
    } else {
      this.save();
    }
  }

  save() {
    this.setReminderDateTime();
    this.helper.showSuccess(SUCCESS_SAVE);
    this.dialogRef.close({ reminder: this.reminder, isUpdate: this.isUpdate });
  }

  setReminderDateTime() {
    this.reminder.dateTime = moment(this.dateControl.value + this.time, DATE_TIME_PATTERN).toDate();
  }

  getWeatherIcon() {
    return OPEN_WHEATER_ICON_URL.replace('[ICON]', this.reminder.weather.icon);
  }

}
