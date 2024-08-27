import { NgModule } from '@angular/core';
import {
  CommonModule,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SharedModule } from '@shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { AddEditAccountReportComponent } from './account-report/add-edit-account-report/add-edit-account-report.component';
import { AccountReportComponent } from './account-report/account-report.component';
import { AccountReportItemPriceComponent } from './account-report-item-price/account-report-item-price.component';
import { AddEditAccountReportItemPriceComponent } from './account-report-item-price/add-edit-account-report/add-edit-account-report-item-price.component';
import { AccountReportToItemComponent } from './account-report-to-item/account-report-to-item.component';
import { AddEditAccountReportToItemComponent } from './account-report-to-item/add-edit-account-report-to-item/add-edit-account-report-to-item.component';
import { AccountReportItemComponent } from './account-report-item/account-report-item.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeModule } from 'primeng/tree';
import { PickListModule } from 'primeng/picklist';
import { FinancialStatementsReportComponent } from './financial-statements-report/financial-statements-report.component';
import { AggregateComponent } from './aggregate/aggregate.component';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
@NgModule({
  declarations: [
    ReportsComponent,
    AccountReportComponent,
    AddEditAccountReportComponent,
    AccountReportItemPriceComponent,
    AddEditAccountReportItemPriceComponent,
    AccountReportToItemComponent,
    AddEditAccountReportToItemComponent,
    AccountReportItemComponent,
    FinancialStatementsReportComponent,
    AggregateComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    NgOptimizedImage,
    InputNumberModule,
    InputTextareaModule,
    TreeModule,
    TreeSelectModule,
    PickListModule,
    PaginatorModule,
    TooltipModule
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
export class ReportsModule { }
