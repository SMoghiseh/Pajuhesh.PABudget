import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@core/services/app-config.service';

import { fadeInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInAnimation],
  providers: [AnimationService],
})
export class AppComponent implements OnInit {
  constructor(
    public animationService: AnimationService,
    private primengConfig: PrimeNGConfig,
    private config: AppConfigService
  ) {
    Common.prjType = this.config.getAddress('type');
    Common.prjTitle = this.config.getAddress('title');
    Common.prjDescription = this.config.getAddress('description');
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.primengConfig.setTranslation({
      startsWith: 'شروع با',
      contains: 'شامل شود',
      notContains: 'شامل نشود',
      endsWith: 'پایان یابد با',
      equals: 'برابر با',
      notEquals: 'مخالف با',
      matchAll: 'و',
      matchAny: 'یا',
      apply: 'اعمال',
      clear: 'حذف',
      addRule: 'افزودن شرط',
      removeRule: 'حذف شرط',
      noFilter: '',
      lt: 'کوچکتر',
      lte: 'کوچکتر یا برابر',
      gt: 'بزرگتر',
      gte: 'بزرگتر یا برابر',
      is: 'موجود باشد',
      isNot: 'موجود نباشد',
      before: 'قبل',
      after: 'بعد',
      dateIs: 'برابر با',
      dateIsNot: 'مخالف با',
      dateBefore: 'کوچکتر از',
      dateAfter: 'بزرگتر از',
      accept: 'تایید',
      reject: 'لغو',
      choose: 'انتخاب',
      upload: 'بارگذاری',
      cancel: 'انصراف',
      dayNames: [
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنج‌شنبه',
        'جمعه',
        'شنبه',
      ],
      dayNamesShort: [
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنج‌شنبه',
        'جمعه',
        'شنبه',
      ],
      dayNamesMin: [
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنج‌شنبه',
        'جمعه',
        'شنبه',
      ],
      monthNames: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ],
      monthNamesShort: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ],
      dateFormat: 'yy/mm/dd',
      firstDayOfWeek: 6,
      today: 'امروز',
      weekHeader: 'هفته',
      weak: 'ناامن',
      medium: 'ساده',
      strong: 'ایمن',
      passwordPrompt: 'رمز عبور را وارد کنید',
      emptyMessage: 'هیچ ردیفی یافت نشد',
      emptyFilterMessage: 'هیچ ردیفی یافت نشد',
    });
  }
}

export class Common {
  public static prjType: string;
  public static prjTitle: string;
  public static prjDescription: string;
}
