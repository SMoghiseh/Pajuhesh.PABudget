import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationComponent } from './operation.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { PersonelNoComponent } from './personel-no/personel-no.component';
import { SaleComponent } from './sale/sale.component';
import { ContractComponent } from './contract/contract.component';
import { BudgetSourceUseComponent } from './budget-source-use/budget-source-use.component';
import { PlanningComponent } from './planning/planning.component';
import { PlanningValueComponent } from './planning-value/planning-value.component';
import { VisionComponent } from './vision/vision.component';
import { MissionComponent } from './mission/mission.component';
import { BigGoalComponent } from './big-goal/big-goal.component';
import { SwotComponent } from './swot/swot.component';
import { StrategyComponent } from './strategy/strategy.component';
import { BudgetSourceUseListComponent } from './budget-source-use-list-component/budget-source-use-list-component';
import { ProjectComponent } from './project/project.component';
import { ProjectIncomeComponent } from './project-income/project-income.component';
import { ProjectCostComponent } from './project-cost/project-cost.component';
import { ProjectPicComponent } from './project-pic/project-pic.component';
import { PersonelNoDetailComponent } from './personel-no/personel-no-detail/personel-no-detail.component';
import { YearActivityComponent } from './year-activity/year-activity.component';
import { RelatedActivityComponent } from './related-activity/related-activity.component';


const routes: Routes = [
  {
    path: '',
    component: OperationComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'PersonelNo',
            component: PersonelNoComponent,
            title: 'برنامه و بودجه | تعریف عناوین',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'PersonelNo/Detail/:id',
            component: PersonelNoDetailComponent,
            title: 'برنامه و بودجه | تعریف عناوین',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'Sale',
            component: SaleComponent,
            title: 'برنامه و بودجه |  نوع فروش'
          },
          {
            path: 'Contract',
            component: ContractComponent,
            title: 'برنامه و بودجه | تعریف عناوین',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'BudgetSourceUse',
            component: BudgetSourceUseComponent,
            title: 'برنامه و بودجه |  منابع و مصارف',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'BudgetSourceList',
            component: BudgetSourceUseListComponent,
            title: 'برنامه و بودجه |  منابع و مصارف',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'Planning',
            component: PlanningComponent,
            title: 'برنامه و بودجه |  برنامه های کلان',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'PlanningValue/:id',
            component: PlanningValueComponent,
            title: 'برنامه و بودجه | ارزش ها',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'Vision/:id',
            component: VisionComponent,
            title: 'برنامه و بودجه | چشم انداز',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'BigGoal/:id/:visionId',
            component: BigGoalComponent,
            title: 'برنامه و بودجه |  اهداف',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'Mission/:id',
            component: MissionComponent,
            title: 'برنامه و بودجه |  ماموریت',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'SWOT/:id',
            component: SwotComponent,
            title: 'برنامه و بودجه |  SWOT',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'Strategy/:id',
            component: StrategyComponent,
            title: 'برنامه و بودجه |  استراتژی',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'Project',
            component: ProjectComponent,
            title: 'برنامه و بودجه |  پروژه',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'ProjectIncome/:id',
            component: ProjectIncomeComponent,
            title: 'برنامه و بودجه |  برآورد هزینه های پروژه',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'ProjectCost/:id',
            component: ProjectCostComponent,
            title: 'برنامه و بودجه |  هزینه های پروژه',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'ProjectPic/:id',
            component: ProjectPicComponent,
            title: 'برنامه و بودجه |  تصاویر و مستندات پروژه',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'OperationalPlan',
            component: YearActivityComponent,
            title: 'برنامه و بودجه |  تصاویر و مستندات پروژه',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'RelatedActivity/:yearActivityId',
            component: RelatedActivityComponent,
            title: 'برنامه و بودجه | برنامه عملیاتی',
          },
        ],
      },
    ],
  },
  // {
  //   path: '',
  //   component: OperationComponent,
  //   children: [
  //     {
  //       path: '',
  //       canMatch: [authGuard],
  //       children: [
  //         {
  //           path: 'PersonelNo',
  //           component: PersonelNoComponent,
  //           title: 'برنامه و بودجه | بودجه پرسنل',
  //           data: {
  //             reuse: true,
  //             title: 'بودجه پرسنل',
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule { }
