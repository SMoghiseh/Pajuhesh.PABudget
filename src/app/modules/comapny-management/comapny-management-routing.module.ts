import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';
import { CompanyManagementComponent } from './company-management.component';
import { CompanyDefinitionComponent } from './company-definition/company-definition.component';
import { AddEditCompanyComponent } from './company-definition/add-edit-company/add-edit-company.component';

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
          },
          {
            path: 'createCompanyForm',
            component: AddEditCompanyComponent,
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
