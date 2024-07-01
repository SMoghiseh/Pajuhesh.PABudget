import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyInfoComponent } from './company-info.component';
import { authGuard } from '@core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CompanyInfoComponent,
    canMatch: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyInfoRoutingModule { }
