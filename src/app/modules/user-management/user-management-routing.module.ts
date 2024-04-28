

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

import { authGuard } from '@core/guards/auth/auth.guard';

import { UserDefinitionComponent } from './user-definition/user-definition.component';
import { RoleDefinitionComponent } from './role-definition/role-definition.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'CreateUser',
            component: UserDefinitionComponent,
            title: 'برنامه و بودجه | تعریف کاربران',
            data: {
              reuse: true,
              title: 'تعریف کاربران',
              animation: 'UserDefinitionPage',
            },
          },
          {
            path: 'CreateRole',
            component: RoleDefinitionComponent,
            title: 'برنامه و بودجه | تعریف نقش',
            data: {
              reuse: true,
              title: 'تعریف نقش',
              animation: 'RoleDefinitionPage',
            },
          },
          {
            path: 'AssignRoleToUser',
            component: UserRoleAssignmentComponent,
            title: 'برنامه و بودجه | تخصیص نقش به کاربر',
            data: {
              reuse: true,
              title: 'تخصیص نقش به کاربر',
              animation: 'UserRoleAssignmentPage',
            },
          },
          {
            path: '',
            redirectTo: '/usermanagement/createuser',
            pathMatch: 'full',
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
export class UserManagementRoutingModule { }
