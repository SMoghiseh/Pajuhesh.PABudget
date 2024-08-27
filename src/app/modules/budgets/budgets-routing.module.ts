import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetsComponent } from './budgets.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { YearGoalComponent } from './yearGoal/year-goal.component';
import { AssemblyAssignmentsComponent } from './assemblyAssignments/assembly-assignments.component';

import { AssumptionsComponent } from './assumptions/assumptions.component';
import { YearActivityComponent } from './year-activity/year-activity.component';
import { RelatedActivityComponent } from './related-activity/related-activity.component';
import { YearPolicyComponent } from './year-policy/year-policy.component';
import { YearRiskComponent } from './year-risk/year-risk.component';

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
            path: 'YearUnion/:id',
            component: AssemblyAssignmentsComponent,
            title: 'برنامه و بودجه |  تکالیف مجمع',
          },
          {
            path: 'Assumptions/:id',
            component: AssumptionsComponent,
            title: 'برنامه و بودجه | مفروضات',
          },
          {
            path: 'YearActivity/:budgetPeriodId/:yearGoalId',
            component: YearActivityComponent,
            title: 'برنامه و بودجه | برنامه عملیاتی',
          },
          {
            path: 'RelatedActivity/:yearActivityId',
            component: RelatedActivityComponent,
            title: 'برنامه و بودجه | برنامه عملیاتی',
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
