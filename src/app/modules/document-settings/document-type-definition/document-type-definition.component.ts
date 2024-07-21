import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import {
  DocumentType,
  DocumentTypeGroup,
  PeriodType,
  UrlBuilder,
} from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'app-document-type-definition',
  templateUrl: './document-type-definition.component.html',
  styleUrls: ['./document-type-definition.component.scss'],
  providers: [ConfirmationService],
})
export class DocumentTypeDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  documentTypes: DocumentType[] = [];
  documentTypesTree: DocumentType[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewDocumentTypeForm!: FormGroup;

  addNewDocumentTypeModel = new DocumentType();

  get title() {
    return this.addNewDocumentTypeForm.get('title');
  }
  get code() {
    return this.addNewDocumentTypeForm.get('code');
  }

  get parentId() {
    return this.addNewDocumentTypeForm.get('parentId');
  }

  get periodTypeId() {
    return this.addNewDocumentTypeForm.get('periodTypeId');
  }

  addNewDocumentTypeLoading = false;

  addNewDocumentTypeFormSubmitted = false;

  selectedDocumentType = new DocumentType();

  groupsLst!: DocumentTypeGroup[];

  periodTypeLst!: PeriodType[];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getDocumentTypes();
    this.getDocumentTypesTree();
    this.getGroups();
    this.getPeriodType();
    this.addNewDocumentTypeForm = new FormGroup({
      title: new FormControl(
        this.addNewDocumentTypeModel.label,
        Validators.required
      ),
      code: new FormControl(this.addNewDocumentTypeModel.code),
      parentId: new FormControl(this.addNewDocumentTypeModel.parentId),
      documentTypeGroupId: new FormControl(
        this.addNewDocumentTypeModel.documentTypeGroupId
      ),
      periodTypeId: new FormControl(
        this.addNewDocumentTypeModel.periodTypeId
      ),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get documentTypes from server. */
  getDocumentTypes() {
    this.loading = true;

    this.httpService
      .get<DocumentType[]>(
        UrlBuilder.build(DocumentType.apiAddress, 'LIST')
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new DocumentType()];
        })
      )
      .subscribe(
        documentTypes => (this.documentTypes = documentTypes)
      );
  }

  getDocumentTypesTree() {
    this.loading = true;
    this.httpService
      .get<DocumentType[]>(
        UrlBuilder.build(DocumentType.apiAddress, 'TREE')
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new DocumentType()];
        })
      )
      .subscribe(
        documentTypes => (this.documentTypesTree = documentTypes)
      );
  }

  getPeriodType() {
    this.loading = true;
    this.httpService
      .get<PeriodType[]>(UrlBuilder.build(PeriodType.apiAddress, 'LIST'))
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new PeriodType()];
        })
      )
      .subscribe(periodTypeLst => (this.periodTypeLst = periodTypeLst));
  }

  addOrUpdateDocumentType() {
    this.addNewDocumentTypeFormSubmitted = true;

    if (this.addNewDocumentTypeForm.valid) {
      this.addNewDocumentTypeLoading = true;

      const { title, code, parentId, documentTypeGroupId, periodTypeId } =
        this.addNewDocumentTypeForm.value;

      const request = new DocumentType();
      request.id = this.selectedDocumentType.key || 0;
      request.title = title;
      request.code = code;
      request.parentId = parentId?.key;
      request.documentTypeGroupId = documentTypeGroupId;
      request.periodTypeId = periodTypeId;

      const typeOpe = request.key ? 'UPDATE' : 'CREATE';

      this.httpService
        .post<DocumentType>(
          UrlBuilder.build(DocumentType.apiAddress, typeOpe),
          request
        )
        .pipe(
          tap(() => {
            this.addNewDocumentTypeLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getDocumentTypes();
            this.getDocumentTypesTree();
            this.messageService.add({
              key: 'documentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع اسناد`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewDocumentTypeForm();
          }
        });
    }
  }

  editRow(documentType: DocumentType) {
    if (documentType.key) {
      if (typeof documentType.parentId == 'number') {
        const fltr = this.documentTypes.filter(
          x => x.key == documentType.parentId
        );
        documentType.parentId = fltr[0];
      }
      documentType.title = documentType.label;
      this.selectedDocumentType = documentType;
      this.addNewDocumentTypeForm.patchValue(documentType);
    }
  }

  deleteRow(documentType: DocumentType) {
    if (documentType && documentType.key)
      this.confirmationService.confirm({
        message: 'آیا از حذف نوع اسناد اطمینان دارید؟',
        header: `نوع اسناد ${documentType.label}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () =>
          this.deleteDocumentType(
            documentType.key,
            documentType.label
          ),
      });
  }

  deleteDocumentType(id: number, type: string) {
    if (id && type) {
      this.httpService
        .get<DocumentType>(
          UrlBuilder.build(DocumentType.apiAddress, 'REMOVE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.getDocumentTypes();

            this.messageService.add({
              key: 'documentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع اسناد ${type}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewDocumentTypeForm();
          }
        });
    }
  }

  resetAddNewDocumentTypeForm() {
    this.addNewDocumentTypeFormSubmitted = false;
    this.addNewDocumentTypeForm.reset();
    this.selectedDocumentType = new DocumentType();
  }

  getGroups() {
    const body = {
      withOutPagination: false,
    };

    this.httpService
      .get<DocumentTypeGroup[]>(
        DocumentTypeGroup.apiAddress
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new DocumentTypeGroup()];
        })
      )
      .subscribe(groups => (this.groupsLst = groups));
  }
}
