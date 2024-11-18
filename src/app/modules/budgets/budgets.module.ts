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
import { InputNumberModule } from 'primeng/inputnumber';
import { AssemblyAssignmentsDetailsComponent } from './assembly-assignments-details/assembly-assignments-details.component';
import { AddEditAssemblyAssignmentsDetailsComponent } from './assembly-assignments-details/add-edit-assembly-assignments-details/add-edit-assembly-assignments-details.component';
import { YearPolicyComponent } from './year-policy/year-policy.component';
import { AddEditYearPolicyComponent } from './year-policy/add-edit-year-policy/add-edit-year-policy.component';
import { YearRiskComponent } from './year-risk/year-risk.component';
import { AddEditYearRiskComponent } from './year-risk/add-edit-year-risk/add-edit-year-risk.component';
import { FinancialRatiosPriceComponent } from './financial-ratios-price/financial-ratios-price.component';
import { AddEditFinancialRatiosPriceComponent } from './financial-ratios-price/add-edit-financial-ratios-price/add-edit-financial-ratios-price.component';
import { FinancialRatiosIndustryComponent } from './financial-ratios-industry/financial-ratios-industry.component';
import { AddEditFinancialRatiosIndustryComponent } from './financial-ratios-industry/add-edit-financial-ratios-industry/add-edit-financial-ratios-industry.component';
import { RelatedYearRiskComponent } from './related-year-risk/related-year-risk.component';
import { AddEditRelatedYearRiskComponent } from './related-year-risk/add-edit-related-year-risk/add-edit-related-year-risk.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RelatedIndicatorComponent } from './related-indicator/related-indicator.component';
import { DetailIndicatorComponent } from './related-indicator/detail-indicator/detail-indicator.component';

@NgModule({
  declarations: [
    BudgetsComponent,
    YearGoalComponent,
    AddEditYearGoalComponent,
    AddEditAssumptionsComponent,
    AssemblyAssignmentsComponent,
    AddEditAssemblyAssignmentsComponent,
    AssumptionsComponent,
    AssemblyAssignmentsDetailsComponent,
    AddEditAssemblyAssignmentsDetailsComponent,
    YearPolicyComponent,
    AddEditYearPolicyComponent,
    YearRiskComponent,
    AddEditYearRiskComponent,
    FinancialRatiosPriceComponent,
    AddEditFinancialRatiosPriceComponent,
    FinancialRatiosIndustryComponent,
    AddEditFinancialRatiosIndustryComponent,
    RelatedYearRiskComponent,
    AddEditRelatedYearRiskComponent,
    RelatedIndicatorComponent,
    DetailIndicatorComponent
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
    InputNumberModule,
    OverlayPanelModule
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
