import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth/auth.guard';
import { HomeComponent } from './home.component';
import { MainHomeComponent } from './components/main-home/main-home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'main-home',
        canMatch: [authGuard],
        children: [],
        component: MainHomeComponent,
        data: { title: 'خانه' },
      },
      {
        path: 'Dashboard',
        canMatch: [authGuard],
        children: [],
        component: DashboardComponent,
        data: { title: 'داشبورد', showSideBar: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
