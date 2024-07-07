import { NgModule } from '@angular/core';
import { CommonModule, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

import { TreeOrganizationRoutingModule } from './tree-organization-routing.module';
import { TreeOrganizationComponent } from './tree-organization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TreeSelectModule } from 'primeng/treeselect';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    TreeOrganizationComponent
  ],
  imports: [
    CommonModule,
    TreeOrganizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    PanelModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ToastModule,
    BlockUIModule,
    TreeSelectModule,
    OrganizationChartModule,
  ] ,
  providers:[
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `assets/images/${config.src}`;
      },
    },
  ],
})
export class TreeOrganizationModule { }
