/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicsManagementComponent } from './basics-management.component';

import { authGuard } from '@core/guards/auth/auth.guard';

import { SubjectDefinitionComponent } from './subject-definition/subject-definition.component';
import { BasicsDefinitionComponent } from './basics-definition/basics-definition.component';
import { PeriodDefinitionComponent } from './period-definition/period-definition.component';
import { ProductGroupComponent } from './product-group/product-group.component';
import { FinancialRatioComponent } from './financial-ratio/financial-ratio.component';


const routes: Routes = [
  { 
    path: '',
    component: BasicsManagementComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'master',
            component: SubjectDefinitionComponent,
            title: 'برنامه و بودجه | تعریف عناوین',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'slaves',
            component: BasicsDefinitionComponent,
            title: 'برنامه و بودجه | تعریف اطلاعات پایه',
            data: {
              reuse: true,
              title: 'تعریف اطلاعات پایه',
              animation: 'BasicsDefinitionPage',
            },
          },
          {
            path: 'period',
            component: PeriodDefinitionComponent,
            title: 'برنامه و بودجه | تعریف دوره',
            data: {
              reuse: true,
              title: 'تعریف دوره',
            },
          },
          {
            path: 'period/:id',
            component: PeriodDefinitionComponent,
            title: 'برنامه و بودجه | تعریف دوره عملیاتی',
            data: {
              reuse: true,
              title: 'تعریف دوره عملیاتی',
            },
          },
          {
            path: 'ProductGroup',
            component: ProductGroupComponent,
            title: 'برنامه و بودجه | تعریف دوره',
            data: {
              reuse: true,
              title: 'تعریف دوره',
            },
          },
          {
            path: 'FinancialRatio',
            component: FinancialRatioComponent,
            title: 'برنامه و بودجه | تعریف نسبت های مالی',
            data: {
              reuse: true,
              title: 'تعریف نسبت های مالی',
            },
          },
          {
            path: '',
            redirectTo: '/baseinfo/createmasters',
            pathMatch: 'full',
          },
          // {
          //   path: 'Indicator',
          //   component: IndicatorComponent,
          //   title: 'برنامه و بودجه | تعریف نسبت های مالی',
          //   data: {
          //     reuse: true,
          //     title: 'تعریف نسبت های مالی',
          //   },
          // },
          // {
          //   path: 'IndicatorValue/:id',
          //   component: IndicatorValueComponent,
          //   title: 'برنامه و بودجه |   اهداف سالیانه',
          // },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicsManagementRoutingModule { }
