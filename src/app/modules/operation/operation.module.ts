import { NgModule } from '@angular/core';
import {
  CommonModule,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

/* PrimeNG */
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TooltipModule } from 'primeng/tooltip';

import { OperationRoutingModule } from './operation-routing.module';
import { OperationComponent } from './operation.component';
import { PersonelNoComponent } from './personel-no/personel-no.component';
import { AddEditPersonelNoComponent } from './personel-no/add-edit-personel-no/add-edit-personel-no.component';
import { SaleComponent } from './sale/sale.component';
import { AddEditSaleComponent } from './sale/add-edit-sale/add-edit-sale.component';
import { ContractComponent } from './contract/contract.component';
import { AddEditContractNoComponent } from './contract/add-edit-contract-no/add-edit-contract-no.component';
import { BudgetSourceUseComponent } from './budget-source-use/budget-source-use.component';
import { AddEditBudgetSourceUseComponent } from './budget-source-use/add-edit-budget-source-use/add-edit-budget-source-use.component';
import { PlanningComponent } from './planning/planning.component';
import { AddEditPlanningComponent } from './planning/add-edit-planning/add-edit-planning.component';
import { MenuModule } from 'primeng/menu';
import { PlanningValueComponent } from './planning-value/planning-value.component';
import { AddEditPlanningValueComponent } from './planning-value/add-edit-planning/add-edit-planning-value.component';
import { VisionComponent } from './vision/vision.component';
import { AddEditVisionComponent } from './vision/add-edit-vision/add-edit-vision.component';
import { MissionComponent } from './mission/mission.component';
import { AddEditMissionComponent } from './mission/add-edit-mission/add-edit-mission.component';
import { BigGoalComponent } from './big-goal/big-goal.component';
import { AddEditBigGoalComponent } from './big-goal/add-edit-big-goal/add-edit-big-goal.component';
import { AddEditSwotComponent } from './swot/add-edit-swot/add-edit-swot.component';
import { SwotComponent } from './swot/swot.component';
import { StrategyComponent } from './strategy/strategy.component';
import { AddEditStrategyComponent } from './strategy/add-edit-strategy/add-edit-strategy.component';


@NgModule({
  declarations: [
    OperationComponent,
    PersonelNoComponent,
    AddEditPersonelNoComponent,
    ContractComponent,
    AddEditContractNoComponent,
    SaleComponent,
    AddEditSaleComponent,
    BudgetSourceUseComponent,
    AddEditBudgetSourceUseComponent,
    PlanningComponent,
    AddEditPlanningComponent,
    PlanningValueComponent,
    AddEditPlanningValueComponent,
    VisionComponent,
    AddEditVisionComponent,
    MissionComponent,
    AddEditMissionComponent,
    BigGoalComponent,
    AddEditBigGoalComponent,
    SwotComponent,
    AddEditSwotComponent,
    StrategyComponent,
    AddEditStrategyComponent
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
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
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TreeSelectModule,
    InputNumberModule,
    KeyFilterModule,
    TooltipModule,
    MenuModule
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
export class OperationModule { }
