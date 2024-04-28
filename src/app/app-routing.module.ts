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
        path: 'UserManagment',
        title: 'برنامه بودجه | مدیریت کاربران',
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then(
            m => m.UserManagementModule
          ),
        canMatch: [authGuard],
      },
    ],
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
export class AppRoutingModule { }
