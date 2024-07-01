import { NgModule } from '@angular/core';
import { CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';

import { CompanyInfoRoutingModule } from './company-info-routing.module';
import { BongahdariComponent } from './bongahdari/bongahdari.component';
import { TableModule } from 'primeng/table';
import { CompanyInfoComponent } from './company-info.component';
import { SharedModule } from '@shared/shared.module';
import { SazmaniComponent } from './sazmani/sazmani.component';
import { TaminEjtemaeeComponent } from './tamin-ejtemaee/tamin-ejtemaee.component';


@NgModule({
  declarations: [
    CompanyInfoComponent,
    BongahdariComponent,
    SazmaniComponent,
    TaminEjtemaeeComponent
  ],
  imports: [
    CommonModule,
    CompanyInfoRoutingModule,
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
export class CompanyInfoModule { }
