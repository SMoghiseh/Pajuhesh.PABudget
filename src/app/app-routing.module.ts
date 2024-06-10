import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth/auth.guard';
import { AccountModule } from './modules/account/account.module';

import { MainComponent } from './core/main/main.component';
import { PageNotFoundComponent } from './core/layout/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    title: 'برنامه بودجه',
    canActivate: [authGuard],
    data: { animation: 'mainPage' },
    children: [
      {
        path: 'default',
        title: 'برنامه بودجه | صفحه اصلی',
        loadChildren: () =>
          import('../app/modules/home/home.module').then(
            module => module.HomeModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'Operation',
        title: 'برنامه و بودجه | عملیات',
        loadChildren: () =>
          import('./modules/operation/operation.module').then(
            m => m.OperationModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'baseinfo',
        title: 'برنامه و بودجه | مدیریت اطلاعات پایه',
        loadChildren: () =>
          import('./modules/basics-management/basics-management.module').then(
            m => m.BasicsManagementModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'UserManagment',
        title: 'برنامه بودجه | مدیریت کاربران',
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then(
            m => m.UserManagementModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'DocSettings',
        title: 'برنامه و بودجه | تنظیمات پایه اسناد',
        loadChildren: () =>
          import('./modules/document-settings/document-settings.module').then(
            m => m.DocumentSettingsModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'Comapny',
        title: 'برنامه و بودجه |مدیریت سازمان ها',
        loadChildren: () =>
          import('./modules/comapny-management/comapny-management.module').then(
            m => m.ComapnyManagementModule
          ),
        canMatch: [authGuard],
      },
      {
        path: 'FinancialexpertDocuments',
        title: 'برنامه و بودجه | مدیریت تاییدات',
        loadChildren: () =>
          import('./modules/financial-expert/financial-expert.module').then(
            m => m.FinancialExpertModule
          ),
        canMatch: [authGuard],
      },
    ],
  },
  {
    path: 'TreeOrganization',
    title: 'برنامه و بودجه |  ساختار درختی شرکت ها ',
    loadChildren: () =>
      import('./modules/tree-organization/tree-organization.module').then(
        m => m.TreeOrganizationModule
      ),
  },
  {
    path: 'account',
    title: 'برنامه بودجه | ورود',
    loadChildren: () => AccountModule,
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
