import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationComponent } from './operation.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { PersonelNoComponent } from './personel-no/personel-no.component';
import { SaleComponent } from './sale/sale.component';
import { ContractComponent } from './contract/contract.component';

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
