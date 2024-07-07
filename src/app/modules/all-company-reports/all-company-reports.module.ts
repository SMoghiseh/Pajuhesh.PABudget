import { NgModule } from '@angular/core';
import { CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';

import { AllCompanyReportsRoutingModule } from './all-company-reports-routing.module';
import { BongahdariComponent } from './bongahdari/bongahdari.component';
import { TableModule } from 'primeng/table';
import { AllCompanyReportsComponent } from './all-company-reports.component';
import { SharedModule } from '@shared/shared.module';
import { SazmaniComponent } from './sazmani/sazmani.component';
import { TaminEjtemaeeComponent } from './tamin-ejtemaee/tamin-ejtemaee.component';


@NgModule({
  declarations: [
    AllCompanyReportsComponent,
    BongahdariComponent,
    SazmaniComponent,
    TaminEjtemaeeComponent
  ],
  imports: [
    CommonModule,
    AllCompanyReportsRoutingModule,
   SharedModule,
   NgOptimizedImage
  ],
  providers:[
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `assets/images/${config.src}`;
      },
    },
  ],
})
export class AllCompanyReportsModule { }
