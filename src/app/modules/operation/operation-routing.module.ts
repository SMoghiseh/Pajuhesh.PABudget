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
            path: 'PlanningValue',
            component: PlanningValueComponent,
            title: 'برنامه و بودجه | ارزش ها',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
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
