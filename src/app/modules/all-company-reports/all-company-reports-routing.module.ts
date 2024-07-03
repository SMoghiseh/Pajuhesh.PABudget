import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCompanyReportsComponent } from './all-company-reports.component';
import { authGuard } from '@core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AllCompanyReportsComponent,
    canMatch: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllCompanyReportsRoutingModule { }
