import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';
import { ReportsComponent } from './reports.component';
import { AccountReportComponent } from './account-report/account-report.component';
import { AccountReportItemPriceComponent } from './account-report-item-price/account-report-item-price.component';
import { AccountReportToItemComponent } from './account-report-to-item/account-report-to-item.component';
import { AccountReportItemComponent } from './account-report-item/account-report-item.component';
import { AggregateComponent } from './aggregate/aggregate.component';
import { FinancialStatementsReportComponent } from './financial-statements-report/financial-statements-report.component';
import { BenefitCostReportComponent } from './benefit-cost-report/benefit-cost-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'AccountReport',
            component: AccountReportComponent,
            title: 'برنامه و بودجه |  انواع گزارش   ',
            data: {
              reuse: true,
              title: ' ',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'AccountReportToItem/:id',
            component: AccountReportToItemComponent,
            title: 'برنامه و بودجه |   آیتم های گزارشات مالی   ',
            data: {
              reuse: true,
              title: ' ',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'AccountReportToItem',
            component: AccountReportToItemComponent,
            title: 'برنامه و بودجه |   آیتم های گزارشات مالی   ',
            data: {
              reuse: true,
              title: ' ',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'AccountReportItemPrice',
            component: AccountReportItemPriceComponent,
            title: 'برنامه و بودجه |  مبلغ آیتمهای گزارشات مالی  ',
            data: {
              reuse: true,
              title: ' ',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'AccountReportItem',
            component: AccountReportItemComponent,
            title: 'برنامه و بودجه |  آیتم های گزارشات مالی ',
            data: {
              reuse: true,
              title: ' ',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'FinancialStatementsReport',
            component: FinancialStatementsReportComponent,
            title: 'برنامه و بودجه |  گزارش صورت وضعیت مالی ',
          },
          {
            path: 'BenefitCostReport',
            component: BenefitCostReportComponent,
            title: 'برنامه و بودجه |  گزارش سود و زیان   ',
          },
          {
            path: 'AggregateCreate/:id',
            component: AggregateComponent,
            title: 'برنامه و بودجه | گزارش ',
            data: {
              reuse: true,
              title: ' ',
              animation: 'SubjectDefinitionPage',
            },
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
export class ReportsRoutingModule { }
