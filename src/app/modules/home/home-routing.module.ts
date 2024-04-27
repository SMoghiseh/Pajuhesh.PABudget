import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth/auth.guard';
import { HomeComponent } from './home.component';
import { MainHomeComponent } from './components/main-home/main-home.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
