import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentSettingsComponent } from './document-settings.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { FileTypeDefinitionComponent } from './file-type-definition/file-type-definition.component';
import { AttachmentTypeDefinitionComponent } from './attachment-type-definition/attachment-type-definition.component';
import { DocumentTypeDefinitionComponent } from './document-type-definition/document-type-definition.component';
import { DocumentNeedsComponent } from './document-needs/document-needs.component';
import { OnlineDocumentDefinitionComponent } from './online-document-definition/online-document-definition.component';
import { TagTypeDefinitionComponent } from './tag-type-definition/tag-type-definition.component';
import { DocumentTagsComponent } from './document-tags/document-tags.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentSettingsComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'FileMimeType',
            component: FileTypeDefinitionComponent,
            title: 'برنامه و بودجه | تعریف نوع فایل',
            data: {
              reuse: true,
              title: 'تعریف نوع فایل',
              animation: 'FileTypeDefinitionPage',
            },
          },
          {
            path: 'AttachmentFileType',
            component: AttachmentTypeDefinitionComponent,
            title: 'برنامه و بودجه | تعریف نوع پیوست',
            data: {
              reuse: true,
              title: 'تعریف نوع پیوست',
              animation: 'AttachmentTypeDefinitionPage',
            },
          },
          {
            path: 'DocumentType',
            component: DocumentTypeDefinitionComponent,
            title: 'برنامه و بودجه | تعریف انواع اسناد',
            data: {
              reuse: true,
              title: 'تعریف انواع اسناد',
              animation: 'DocumentTypeDefinitionPage',
            },
          },
          {
            path: 'DocTyeFileNeeds',
            component: DocumentNeedsComponent,
            title: 'برنامه و بودجه | نیازمندی های اسناد',
            data: {
              reuse: true,
              title: 'نیازمندی های اسناد',
              animation: 'DocumentNeeds',
            },
          },
          {
            path: 'OnlineDocDefinition',
            component: OnlineDocumentDefinitionComponent,
            title: 'برنامه و بودجه | اسناد برخط',
            data: {
              reuse: true,
              title: 'اسناد برخط',
              animation: 'OnlineDocumentDefinitionPage',
            },
          },
          {
            path: 'TagType',
            component: TagTypeDefinitionComponent,
            title: 'برنامه و بودجه | نوع تگ',
            data: {
              reuse: true,
              title: 'نوع تگ',
              animation: 'TagTypePage',
            },
          },

          {
            path: 'DocTypeTags',
            component: DocumentTagsComponent,
            title: 'برنامه و بودجه | تگ های اسناد',
            data: {
              reuse: true,
              title: 'تگ های اسناد',
              animation: 'DocumentTypeTagsPage',
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentSettingsRoutingModule { }
