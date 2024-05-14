import { Component } from '@angular/core';

@Component({
  selector: 'PABudget-tree-organization',
  templateUrl: './tree-organization.component.html',
  styleUrls: ['./tree-organization.component.scss']
})
export class TreeOrganizationComponent {
  data: any = {}

  ngOnInit(): void {

    this.data = [
      {
        title: 'دبیرخانه هیات امنایی سازمان تامین اجتماعی و صندوق',
        children: [
          {
            title: 'صندوق بازنشستگی کشوری',
            children: [
              { title: '1سرمایه گذاری آتیه صبا' },
              { title: '1سرمایه گذاری  صندوقبازنشستگی کشوری' },
            ]
          },
          {
            title: 'بانک توسعه تعاون',
            children: [
              { title: '2سرمایه گذاری  صندوقبازنشستگی کشوری' },
            ]
          },
          {
            title: 'صندوق حمایت و بازنشستگی آینده ساز ',
            children: [
              { title: '3سرمایه گذاری آتیه صبا' },
              { title: '3گروه مدیریت ارزش سرمایه' },
              { title: '3گروه مدیریت ارزش سرمایه' }
            ]
          },
          {
            title: '  صندوق بیمه اجتماعی',
            children: [
              { title: '4سرمایه گذاری آتیه صبا' },
              { title: '4سرمایه گذاری  صندوقبازنشستگی کشوری' },
              { title: '4گروه مدیریت ارزش سرمایه' }
            ]
          },
          {
            title: 'صندوق حمایت و بازنشستگی  کارکنان فولاد ',
            children: [
              { title: '5سرمایه گذاری آتیه صبا' },
              { title: '5سرمایه گذاری  صندوقبازنشستگی کشوری' },
              { title: '5گروه مدیریت ارزش سرمایه' }
            ]
          },
        ]
      }
    ]

  }

}
