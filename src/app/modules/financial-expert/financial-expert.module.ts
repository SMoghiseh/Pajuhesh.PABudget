import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { FinancialExpertRoutingModule } from './financial-expert-routing.module';
import { FinancialExpertComponent } from './financial-expert.component';
import { NotificationDefinitionComponent } from './notification-definition/notification-definition.component';
import { MdlOnlineDocLstComponent } from './notification-definition/mdl-online-doc-lst/mdl-online-doc-lst.component';
import { MydocumentsComponent } from './mydocuments/mydocuments.component';
import { ActiveOnlineDocsComponent } from './active-online-docs/active-online-docs.component';
import { AllDocumentsComponent } from './all-documents/all-documents.component';

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

import { DocsFormComponent } from './all-documents/docs-form/docs-form.component';
import { DocumentTblsComponent } from '@shared/components/document-tbls/document-tbls.component';
import { DocumentDetailComponent } from '@shared/components/document-detail/document-detail.component';
import { EditTagsComponent } from './all-documents/edit-tags/edit-tags.component';

@NgModule({
  declarations: [
    FinancialExpertComponent,
    NotificationDefinitionComponent,
    MydocumentsComponent,
    MdlOnlineDocLstComponent,
    ActiveOnlineDocsComponent,
    AllDocumentsComponent,
    DocsFormComponent,
    DocumentTblsComponent,
    EditTagsComponent,
    DocumentDetailComponent
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
