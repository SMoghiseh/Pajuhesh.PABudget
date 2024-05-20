import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeOrganizationComponent } from './tree-organization.component';
import { authGuard } from '@core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TreeOrganizationComponent,
    canMatch: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreeOrganizationRoutingModule { }
