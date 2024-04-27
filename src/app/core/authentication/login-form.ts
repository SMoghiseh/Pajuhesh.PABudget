import { DNTCaptchaBase } from 'src/app/modules/account/login/dnt-captcha/dnt-captcha-base';

export class LoginForm extends DNTCaptchaBase {
  constructor(public username: string, public password: string) {
    super();
  }
}
