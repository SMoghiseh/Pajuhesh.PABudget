import { NgModule } from '@angular/core';
import {
  CommonModule,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';

import { ComapnyManagementRoutingModule } from './comapny-management-routing.module';
import { CompanyManagementComponent } from './company-management.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';

/* PrimeNG */
import { TableModule, TableCheckbox } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeModule } from 'primeng/tree';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { TreeSelectModule } from 'primeng/treeselect';
import { FileUploadModule } from 'primeng/fileupload';
import { TreeTableModule } from 'primeng/treetable';

import { CompanyDefinitionComponent } from './company-definition/company-definition.component';
import { AddEditCompanyComponent } from './company-definition/add-edit-company/add-edit-company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyContractComponent } from './company-profile/company-contract/company-contract.component';
import { AddEditContractComponent } from './company-profile/company-contract/add-edit-contract/add-edit-contract.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { SelectDateComponent } from './company-profile/select-date/select-date.component';
import { VisionAndMissionComponent } from './company-profile/plan-badget-detail/plans/vision-and-mission/vision-and-mission.component';
import { ValueComponent } from './company-profile/plan-badget-detail/plans/value/value.component';
import { GoalsComponent } from './company-profile/plan-badget-detail/plans/goals/goals.component';
import { OperationalPlansComponent } from './company-profile/plan-badget-detail/plans/operational-plans/operational-plans.component';
import { OrientationComponent } from './company-profile/plan-badget-detail/plans/orientation/orientation.component';
import { StrategyMapComponent } from './company-profile/plan-badget-detail/plans/strategy-map/strategy-map.component';
import { InformationsComponent } from './company-profile/plan-badget-detail/plans/informations/informations.component';
import { RiskComponent } from './company-profile/plan-badget-detail/plans/risk/risk.component';
import { BalanceSheetComponent } from './company-profile/plan-badget-detail/budget/balance-sheet/balance-sheet.component';
import { CostAndBenefitComponent } from './company-profile/plan-badget-detail/budget/cost-and-benefit/cost-and-benefit.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { BudgetResourceUseComponent } from './company-profile/plan-badget-detail/budget/budget-resource-use/budget-resource-use.component';
import { SeniorManagersComponent } from './senior-managers/senior-managers.component';
import { AddEditSeniorManagersComponent } from './senior-managers/add-edit-senior-managers/add-edit-senior-managers.component';
import { OwnerShipValueComponent } from './company-profile/plan-badget-detail/budget/owner-ship-value/owner-ship-value.component';
import { MatrixSwotComponent } from './company-profile/plan-badget-detail/plans/matrix-swot/matrix-swot.component';
import { StrategyPlanComponent } from './company-profile/plan-badget-detail/plans/strategy-plan/strategy-plan.component';
import { AssemblyAssignmentsPlanComponent } from './company-profile/plan-badget-detail/plans/assembly-assignments-plan/assembly-assignments-plan.component';
import { StatementCashFlowsComponent } from './company-profile/plan-badget-detail/plans/statement-cash-flows/statement-cash-flows.component';
import { ReconciliationStatementOperatingComponent } from './company-profile/plan-badget-detail/plans/reconciliation-statement-operating/reconciliation-statement-operating.component';
import { ReceiveAndPayComponent } from './company-profile/plan-badget-detail/plans/receive-and-pay/receive-and-pay.component';
import { ShareholderComponent } from './company-profile/plan-badget-detail/plans/shareholder/shareholder.component';
import { AnnualGolsComponent } from './company-profile/plan-badget-detail/plans/annual-gols/annual-gols.component';
import { ShareHolderCompanyComponent } from './share-holder-company/share-holder-company.component';
import { AddEditShareHolderCompanyComponent } from './share-holder-company/add-edit-share-holder-company/add-edit-share-holder-company.component';
import { MenuModule } from 'primeng/menu';
import { CompanyDefinitionLookupComponent } from './share-holder-company/company-definition-lookup/company-definition-lookup.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { GraphComponent } from './company-profile/plan-badget-detail/plans/strategy-map/graph/graph.component';
import { EmployeesComponent } from './company-profile/plan-badget-detail/plans/employees/employees.component';
import { DetailStrategyPlanComponent } from './company-profile/plan-badget-detail/plans/strategy-plan/detail-strategy-plan/detail-strategy-plan.component';
import { PlanComponent } from './company-profile/plan-badget-detail/plans/plan/plan.component';

@NgModule({
  declarations: [
    CompanyManagementComponent,
    CompanyDefinitionComponent,
    AddEditCompanyComponent,
    CompanyProfileComponent,
    CompanyContractComponent,
    AddEditContractComponent,
    CompanyDetailComponent,
    SafeHtmlPipe,
    SelectDateComponent,
    VisionAndMissionComponent,
    ValueComponent,
    OrientationComponent,
    AnnualGolsComponent,
    GoalsComponent,
    StrategyMapComponent,
    StrategyPlanComponent,
    OperationalPlansComponent,
    InformationsComponent,
    RiskComponent,
    BalanceSheetComponent,
    CostAndBenefitComponent,
    BudgetResourceUseComponent,
    SeniorManagersComponent,
    AddEditSeniorManagersComponent,
    OwnerShipValueComponent,
    MatrixSwotComponent,
    AssemblyAssignmentsPlanComponent,
    StatementCashFlowsComponent,
    ReconciliationStatementOperatingComponent,
    ReceiveAndPayComponent,
    ShareholderComponent,
    ShareHolderCompanyComponent,
    AddEditShareHolderCompanyComponent,
    CompanyDefinitionLookupComponent,
    GraphComponent,
    EmployeesComponent,
    DetailStrategyPlanComponent,
    PlanComponent
  ],
  imports: [
    ComapnyManagementRoutingModule,
    NgOptimizedImage,
    CommonModule,
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
    TreeModule,
    BlockUIModule,
    ToastModule,
    ConfirmDialogModule,
    KeyFilterModule,
    TooltipModule,
    DialogModule,
    FileUploadModule,
    CheckboxModule,
    ListboxModule,
    TreeSelectModule,
    InputNumberModule,
    TreeTableModule,
    MenuModule,
    DialogModule,
    NgxGraphModule,
  ],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `assets/images/${config.src}`;
      },
    },
    TableCheckbox,
  ],
})
export class ComapnyManagementModule { }
