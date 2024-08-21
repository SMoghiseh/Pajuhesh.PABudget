import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetsComponent } from './budgets.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { YearGoalComponent } from './yearGoal/year-goal.component';
import { AssumptionsComponent } from './assumptions/assumptions.component';

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
            title: 'برنامه و بودجه |   اهداف سالیانه'
          },
          {
            path: 'Assumptions/:id',
            component: AssumptionsComponent,
            title: 'برنامه و بودجه | مفروضات'
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
