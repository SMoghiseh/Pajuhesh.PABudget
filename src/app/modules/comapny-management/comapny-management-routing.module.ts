import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';
import { CompanyManagementComponent } from './company-management.component';
import { CompanyDefinitionComponent } from './company-definition/company-definition.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyManagementComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'createCompany',
            component: CompanyDefinitionComponent,
            title: 'برنامه و بودجه | تعریف سازمان',
            data: {
              reuse: true,
              title: 'تعریف سازمان',
              animation: 'createCompany',
            },
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComapnyManagementRoutingModule { }
