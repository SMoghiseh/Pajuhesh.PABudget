 

import { AbstractControl, ValidationErrors } from '@angular/forms';

/** اعتبار سنجی گذرواژه */
export class PasswordValidator {
  /**
   * بررسی صحت یکسان بودن گذرواژه و تکرار گذرواژه
   * @param passwordFieldName نام فیلد گذرواژه در فرم کنترل
   * @param rePasswordFieldName نام فیلد تکرار گذرواژه در فرم کنترل
   * @returns
   */
  static matchPasswords(
    passwordFieldName: string,
    rePasswordFieldName: string
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get(passwordFieldName);
      const reNewPassword = control.get(rePasswordFieldName);

      if (newPassword?.value !== reNewPassword?.value) {
        return { passwordsDontMatch: true };
      }
      return null;
    };
  }
}
