import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetsComponent } from './budgets.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { YearGoalComponent } from './yearGoal/year-goal.component';
import { AssemblyAssignmentsComponent } from './assemblyAssignments/assembly-assignments.component';

import { AssumptionsComponent } from './assumptions/assumptions.component';
import { AssemblyAssignmentsDetailsComponent } from './assembly-assignments-details/assembly-assignments-details.component';
import { YearPolicyComponent } from './year-policy/year-policy.component';
import { YearRiskComponent } from './year-risk/year-risk.component';
import { FinancialRatiosPriceComponent } from './financial-ratios-price/financial-ratios-price.component';
import { FinancialRatiosIndustryComponent } from './financial-ratios-industry/financial-ratios-industry.component';
import { RelatedYearRiskComponent } from './related-year-risk/related-year-risk.component';
import { RelatedIndicatorComponent } from './related-indicator/related-indicator.component';
import { DetailIndicatorComponent } from './related-indicator/detail-indicator/detail-indicator.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetsComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'YearGoal/:id',
            component: YearGoalComponent,
            title: 'برنامه و بودجه |   اهداف سالیانه',
          },
          {
            path: 'YearUnion/:budgetPeriodId',
            component: AssemblyAssignmentsComponent,
            title: 'برنامه و بودجه |  تکالیف مجمع',
          },
          {
            path: 'Assumptions/:id',
            component: AssumptionsComponent,
            title: 'برنامه و بودجه | مفروضات',
          },
          {
            path: 'YearUnionDetail/:budgetPeriodId/:id',
            component: AssemblyAssignmentsDetailsComponent,
            title: 'برنامه و بودجه | مفاد',
          },
          {
            path: 'YearPolicy/:id',
            component: YearPolicyComponent,
            title: 'برنامه و بودجه | برنامه عملیاتی',
          },
          {
            path: 'YearRisk/:id',
            component: YearRiskComponent,
            title: 'برنامه و بودجه | برنامه عملیاتی',
          },
          {
            path: 'RelatedYearRiskProgram/:periodId/:yearRisk',
            component: RelatedYearRiskComponent,
            title: 'برنامه و بودجه | برنامه مرتبط ریسک',
          },
          {
            path: 'FinancialRatiosPrice/:id',
            component: FinancialRatiosPriceComponent,
            title: 'برنامه و بودجه | برنامه عملیاتی',
          },
          {
            path: 'FinancialRatiosIndustry/:id',
            component: FinancialRatiosIndustryComponent,
            title: 'برنامه و بودجه | برنامه عملیاتی',
          },
          {
            path: 'RelatedIndicator',
            component: RelatedIndicatorComponent,
            title: 'برنامه و بودجه |  شاخص های مرتبط',
          },
          {
            path: 'RelatedIndicator/:id',
            component: DetailIndicatorComponent,
            title: 'برنامه و بودجه |  شاخص های مرتبط',
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
export class BudgetsRoutingModule { }
