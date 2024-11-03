import { NgModule } from '@angular/core';
import {
  CommonModule,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';


import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeSelectModule } from 'primeng/treeselect';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { KeyFilterModule } from 'primeng/keyfilter';
import { IndicatorDefinitionComponent } from './indicator-definition/indicator-definition.component';
import { AddEditIndicatorValueComponent } from './indicator-value/add-edit-indicator-value/add-edit-indicator-value.component';
import { IndicatorValueComponent } from './indicator-value/indicator-value.component';
import { IndicatorComponent } from './indicator.component';
import { AddEditIndicatorDefinitionComponent } from './indicator-definition/add-edit-indicator-definition/add-edit-indicator-definition.component';
import { IndicatorRoutingModule } from './indicator-routing.module';


@NgModule({
  declarations: [
    IndicatorComponent,
    IndicatorDefinitionComponent,
    IndicatorValueComponent,
    AddEditIndicatorValueComponent,
    AddEditIndicatorDefinitionComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    IndicatorRoutingModule,
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
    MenuModule,
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
export class IndicatorModule {}
