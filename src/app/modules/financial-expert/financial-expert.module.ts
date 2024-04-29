import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { FinancialExpertRoutingModule } from './financial-expert-routing.module';
import { FinancialExpertComponent } from './financial-expert.component';
import { NotificationDefinitionComponent } from './notification-definition/notification-definition.component';
import { ModalOnlineAdvertListComponent } from './notification-definition/mdl-online-advert-lst/mdl-online-advert-lst.component';
import { MyadvertismentsComponent } from './myadvertisments/myadvertisments.component';
import { ActiveOnlineAdvertsComponent } from './active-online-adverts/active-online-adverts.component';
import { AlladvertismentsComponent } from './all-advertisments/all-advertisments.component';

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
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TreeSelectModule } from 'primeng/treeselect';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CarouselModule } from 'primeng/carousel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

import { AdvertsFormComponent } from './all-advertisments/adverts-form/adverts-form.component';
import { AdvertismentTblsComponent } from '@shared/components/advertisment-tbls/advertisment-tbls.component';
import { AdvertismentDetailComponent } from '@shared/components/advertisment-detail/advertisment-detail.component';
import { EditTagsComponent } from './all-advertisments/edit-tags/edit-tags.component';

@NgModule({
  declarations: [
    FinancialExpertComponent,
    NotificationDefinitionComponent,
    MyadvertismentsComponent,
    ModalOnlineAdvertListComponent,
    ActiveOnlineAdvertsComponent,
    AlladvertismentsComponent,
    AdvertsFormComponent,
    AdvertismentTblsComponent,
    EditTagsComponent,
    AdvertismentDetailComponent
  ],
  imports: [
    CommonModule,
    FinancialExpertRoutingModule,
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
    FileUploadModule,
    DialogModule,
    ToastModule,
    TreeSelectModule,
    KeyFilterModule,
    CarouselModule,
    ProgressSpinnerModule,
    CheckboxModule,
    TooltipModule,
    InputNumberModule,
  ],
  providers: [FileUpload],
})
export class FinancialExpertModule { }
