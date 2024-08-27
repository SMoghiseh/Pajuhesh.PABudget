import { NgModule } from '@angular/core';
import {
  CommonModule,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';

import { BudgetsRoutingModule } from './budgets-routing.module';
import { BudgetsComponent } from './budgets.component';
import { YearGoalComponent } from './yearGoal/year-goal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { AddEditYearGoalComponent } from './yearGoal/add-edit-year-goal/add-edit-year-goal.component';
import { AddEditAssumptionsComponent } from './assumptions/add-edit-assumptions/add-edit-assumptions.component';
import { AssemblyAssignmentsComponent } from './assemblyAssignments/assembly-assignments.component';
import { AddEditAssemblyAssignmentsComponent } from './assemblyAssignments/add-edit-assembly-assignments/add-edit-assembly-assignments.component';
import { AssumptionsComponent } from './assumptions/assumptions.component';
import { YearActivityComponent } from './year-activity/year-activity.component';
import { AddEditYearActivityComponent } from './year-activity/add-edit-year-activity/add-edit-year-activity.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { RelatedActivityComponent } from './related-activity/related-activity.component';
import { AddEditRelatedActivityComponent } from './related-activity/add-edit-related-activity/add-edit-related-activity.component';
import { YearPolicyComponent } from './year-policy/year-policy.component';
import { AddEditYearPolicyComponent } from './year-policy/add-edit-year-policy/add-edit-year-policy.component';
import { YearRiskComponent } from './year-risk/year-risk.component';
import { AddEditYearRiskComponent } from './year-risk/add-edit-year-risk/add-edit-year-risk.component';

@NgModule({
  declarations: [
    BudgetsComponent,
    YearGoalComponent,
    AddEditYearGoalComponent,
    AddEditAssumptionsComponent,
    AssemblyAssignmentsComponent,
    AddEditAssemblyAssignmentsComponent,
    AssumptionsComponent,
    YearActivityComponent,
    AddEditYearActivityComponent,
    RelatedActivityComponent,
    AddEditRelatedActivityComponent,
    YearPolicyComponent,
    AddEditYearPolicyComponent,
    YearRiskComponent,
    AddEditYearRiskComponent
  ],
  imports: [
    CommonModule,
    BudgetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    PasswordModule,
    InputTextareaModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    MenuModule,
    NgOptimizedImage,
    InputNumberModule
  ],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `assets/images/${config.src}`;
      },
    },
  ],
})
export class BudgetsModule { }
