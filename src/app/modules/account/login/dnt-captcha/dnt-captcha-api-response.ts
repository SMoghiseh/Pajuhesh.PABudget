﻿export class DNTCaptchaApiResponse {
  data: any;
  constructor(
    public dntCaptchaImgUrl: string = '',
    public dntCaptchaId: string = '',
    public dntCaptchaTextValue: string = '',
    public dntCaptchaTokenValue: string = ''
  ) {}
}
