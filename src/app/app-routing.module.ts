import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth/auth.guard';
import { AccountModule } from './modules/account/account.module';

import { MainComponent } from './core/main/main.component';
import { PageNotFoundComponent } from './core/layout/page-not-found/page-not-found.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'برنامه بودجه',
    children: [
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
          },

          {
            path: 'Operation',

            title: 'برنامه و بودجه | عملیات',

            loadChildren: () =>
              import('./modules/operation/operation.module').then(
                m => m.OperationModule
              ),
          },
          {
            path: 'Reports',

            title: 'برنامه و بودجه | عملیات',

            loadChildren: () =>
              import('./modules/reports/reports.module').then(
                m => m.ReportsModule
              ),
          },

          {
            path: 'baseinfo',

            title: 'برنامه و بودجه | مدیریت اطلاعات پایه',

            loadChildren: () =>
              import(
                './modules/basics-management/basics-management.module'
              ).then(m => m.BasicsManagementModule),
          },

          {
            path: 'UserManagment',

            title: 'برنامه بودجه | مدیریت کاربران',

            loadChildren: () =>
              import('./modules/user-management/user-management.module').then(
                m => m.UserManagementModule
              ),
          },

          {
            path: 'DocSettings',

            title: 'برنامه و بودجه | تنظیمات پایه اسناد',

            loadChildren: () =>
              import(
                './modules/document-settings/document-settings.module'
              ).then(m => m.DocumentSettingsModule),
          },

          {
            path: 'Comapny',

            title: 'برنامه و بودجه |مدیریت سازمان ها',

            loadChildren: () =>
              import(
                './modules/comapny-management/comapny-management.module'
              ).then(m => m.ComapnyManagementModule),
          },

          {
            path: 'FinancialexpertDocuments',

            title: 'برنامه و بودجه | مدیریت تاییدات',

            loadChildren: () =>
              import('./modules/financial-expert/financial-expert.module').then(
                m => m.FinancialExpertModule
              ),
          },
        ],
      },

      {
        path: 'TreeOrganization',

        title: 'برنامه و بودجه | ساختار درختی شرکت ها ',

        loadChildren: () =>
          import('./modules/tree-organization/tree-organization.module').then(
            m => m.TreeOrganizationModule
          ),
        canActivate: [authGuard],
      },

      {
        path: 'AllCompanyReports',

        title: 'برنامه و بودجه | اطلاعات شرکت ها ',

        loadChildren: () =>
          import(
            './modules/all-company-reports/all-company-reports.module'
          ).then(m => m.AllCompanyReportsModule),
        canActivate: [authGuard],
      },

      {
        path: 'account',

        title: 'برنامه بودجه | ورود',

        loadChildren: () => AccountModule,
      },
    ],
  },

  { path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
