import { NgModule } from '@angular/core';
import { CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';

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
import { AssemblyAssignmentsComponent } from './assemblyAssignments/assembly-assignments/assembly-assignments.component';
import { AddEditAssemblyAssignmentsComponent } from './assemblyAssignments/add-edit-assembly-assignments/add-edit-assembly-assignments.component';


@NgModule({
  declarations: [
    BudgetsComponent,
    YearGoalComponent,
    AddEditYearGoalComponent,
    AddEditAssumptionsComponent,
    AssemblyAssignmentsComponent,
    AddEditAssemblyAssignmentsComponent
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
    NgOptimizedImage
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
