import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';
import { CompanyManagementComponent } from './company-management.component';
import { CompanyDefinitionComponent } from './company-definition/company-definition.component';
import { AddEditCompanyComponent } from './company-definition/add-edit-company/add-edit-company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyContractComponent } from './company-profile/company-contract/company-contract.component';
import { AddEditContractComponent } from './company-profile/company-contract/add-edit-contract/add-edit-contract.component';

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
            path: 'CompanyForm',
            component: AddEditCompanyComponent,
            title: 'برنامه و بودجه | تعریف سازمان',
            data: {
              reuse: true,
              title: 'تعریف سازمان',
              animation: 'createCompany',
            },
          },
          {
            path: 'ContractForm',
            component: AddEditContractComponent,
            title: 'برنامه و بودجه | تعریف قرارداد',
            data: {
              reuse: true,
              title: 'تعریف سازمان',
              animation: 'createContract',
            },
          },
          {
            path: 'companyProfile/:id',
            component: CompanyProfileComponent,
            title: 'برنامه و بودجه | پروفایل سازمان',
            data: {
              reuse: true,
              title: 'پروفایل سازمان',
            },
          },
          {
            path: 'contractCompany/:id',
            component: CompanyContractComponent,
            title: 'برنامه و بودجه | پروفایل سازمان',
            data: {
              reuse: true,
              title: 'پروفایل سازمان',
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
export class ComapnyManagementRoutingModule {}
