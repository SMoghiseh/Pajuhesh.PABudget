import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialExpertComponent } from './financial-expert.component';

import { authGuard } from '@core/guards/auth/auth.guard';
import { NotificationDefinitionComponent } from './notification-definition/notification-definition.component';
import { MyadvertismentsComponent } from './myadvertisments/myadvertisments.component';
import { ActiveOnlineAdvertsComponent } from './active-online-adverts/active-online-adverts.component';
import { AlladvertismentsComponent } from './all-advertisments/all-advertisments.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialExpertComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'MyDocument',
            component: MyadvertismentsComponent,
            title: 'برنامه و بودجه | اسناد‌ من',
            data: {
              reuse: true,
              title: 'اسناد‌ من',
              animation: 'ConfirmationDefinitionPage',
              type: 'MyDocument',
            },
          },
          {
            path: 'Registration',
            component: NotificationDefinitionComponent,
            title: 'برنامه و بودجه | تعریف اسناد',
            data: {
              reuse: true,
              title: 'تعریف اسناد',
              animation: 'NotificationDefinitionPage',
            },
          },
          {
            path: 'OnlineDocuments',
            component: ActiveOnlineAdvertsComponent,
            title: 'برنامه و بودجه | اسناد برخط فعال',
            data: {
              reuse: true,
              title: 'اسناد برخط فعال',
              animation: 'ActiveOnlineAdvertsPage',
            },
          },
          {
            path: 'Document',
            component: AlladvertismentsComponent,
            title: 'برنامه و بودجه | کل اسناد',
            data: {
              reuse: true,
              title: 'کل اسناد',
              animation: 'AdvertsPage',
            }
          },
          {
            path: '',
            redirectTo: '/registerandconfirms/RegisterAdvert',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialExpertRoutingModule { }
