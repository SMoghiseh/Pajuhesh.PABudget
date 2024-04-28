import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DocumentSettingsRoutingModule } from './document-settings-routing.module';
import { DocumentSettingsComponent } from './document-settings.component';
import { FileTypeDefinitionComponent } from './file-type-definition/file-type-definition.component';
import { AttachmentTypeDefinitionComponent } from './attachment-type-definition/attachment-type-definition.component';
import { DocumentTypeDefinitionComponent } from './document-type-definition/document-type-definition.component';
import { DocumentNeedsComponent } from './document-needs/document-needs.component';
import { OnlineDocumentDefinitionComponent } from './online-document-definition/online-document-definition.component';
import { TagTypeDefinitionComponent } from './tag-type-definition/tag-type-definition.component';
import { DocumentTagsComponent } from './document-tags/document-tags.component';

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
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
  declarations: [
    DocumentSettingsComponent,
    FileTypeDefinitionComponent,
    AttachmentTypeDefinitionComponent,
    DocumentTypeDefinitionComponent,
    DocumentNeedsComponent,
    OnlineDocumentDefinitionComponent,
    TagTypeDefinitionComponent,
    DocumentTagsComponent,
  ],
  imports: [
    CommonModule,
    DocumentSettingsRoutingModule,
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
    CheckboxModule,
    InputNumberModule,
    FileUploadModule,
    TooltipModule,
    FieldsetModule,
  ],
  providers: [TableModule, FileUpload],
})
export class DocumentSettingsModule { }
