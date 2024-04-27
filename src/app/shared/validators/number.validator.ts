 

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** اعتبار سنجی نحوه ورود شماره‌ها */
export class NumberValidator {
  /**
   * بررسی صحت یکسان بودن گذرواژه و تکرار گذرواژه
   * @param passwordFieldName نام فیلد گذرواژه در فرم کنترل
   * @param rePasswordFieldName نام فیلد تکرار گذرواژه در فرم کنترل
   * @returns
   */
  static mobile(): ValidatorFn {
    const pattern = /^(\+98|0)?9\d{9}$/;

    return (control: AbstractControl): ValidationErrors | null =>
      pattern.test(control.value) ? null : { wrongFormat: true };
  }
}
