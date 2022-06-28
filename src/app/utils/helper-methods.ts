import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import * as moment from 'moment';
import { FULL_DATE } from "./consts";
import { AbstractControl } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class HelperMethods {

  constructor(
    private toastr: ToastrService,
  ) {}

  //#region TOASTR
  showError(msg: string) {
    this.toastr.error(msg, 'Error');
  }
  showInfo(msg: string) {
    this.toastr.info(msg, 'Info');
  }
  showSuccess(msg: string) {
    this.toastr.success(msg, 'Success');
  }
  //#endregion TOASTR

  //#region VALIDATIONS
  isPresent(value: any) {
    const exists = value !== null && value !== undefined;
    return exists && value.hasOwnProperty('length') ? Boolean(value.length) : exists;
  }
  isAnyPresent(...values: any[]) {
    return Boolean(values.filter((v: any) => this.isPresent(v)).length);
  }
  isAllPresent(...values: any[]) {
    return values.every((v: any) => this.isPresent(v));
  }
  checkValidDate(date: string) {
    return date && date.length === FULL_DATE && moment(date, 'MMDDYYYY').isValid();
  }
  dateValidator = (control: AbstractControl): {} | null => {
    let date: string = control.value;
    if(!date || !date.length) return null;
    const invalid: any = { invalidDate: 'Invalid date' };

    date = date.replace(/[/]/g, '');
    if(!this.checkValidDate(date)) return invalid;
    return null;
  }
  //#endregion VALIDATIONS

  //#region OTHERS
  handleError(exception: any) {
    const { cod, message } = exception.error;
    this.showError(`${cod} - ${message}`);
  }
  //#endregion OTHERS
}
