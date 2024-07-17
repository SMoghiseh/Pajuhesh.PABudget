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
    GoalsComponent,
    StrategyMapComponent,
    OperationalPlansComponent,
    InformationsComponent,
    RiskComponent,
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
export class ComapnyManagementModule {}
