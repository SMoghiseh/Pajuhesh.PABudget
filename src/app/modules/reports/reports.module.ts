import { NgModule } from '@angular/core';
import { CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
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


@NgModule({
  declarations: [
    ReportsComponent,
    AccountReportComponent,
    AddEditAccountReportComponent,
    AccountReportItemPriceComponent,
    AddEditAccountReportItemPriceComponent,
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
    DropdownModule,
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
export class ReportsModule { }
