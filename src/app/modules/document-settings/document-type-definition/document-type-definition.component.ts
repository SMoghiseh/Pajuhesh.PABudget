import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import {
  DocumentType, Pagination, UrlBuilder
} from '@shared/models/response.model';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'app-document-type-definition',
  templateUrl: './document-type-definition.component.html',
  styleUrls: ['./document-type-definition.component.scss'],
  providers: [ConfirmationService],
})
export class DocumentTypeDefinitionComponent implements OnInit {

  /** Table */
  totalCount!: number;
  documentTypes: DocumentType[] = [];
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  addEditData = new DocumentType();
  isOpenAddEditDocumentType = false;
  modalTitle = '';
  type = '';
  loading = false;

  // form property
  searchForm!: FormGroup;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      code: new FormControl(null),
      title: new FormControl(null),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get documentTypes from server. */
  getDocumentTypes(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.searchForm.value;
    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      ...formValue,
    };

    this.first = 0;
    const url =
      DocumentType.apiAddress + '/List';
    this.httpService
      .post<DocumentType[]>(
        url, body)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new DocumentType()];
        })
      )
      .subscribe(
        documentTypes => (this.documentTypes = documentTypes)
      );
  }

  addNewItem() {
    this.modalTitle = 'افزودن';
    this.type = 'insert';
    this.isOpenAddEditDocumentType = true;
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
      this.addEditData = documentType;
    }
    this.modalTitle = 'ویرایش ' + documentType.title;
    this.type = 'edit';
    this.isOpenAddEditDocumentType = true;
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

          }
        });
    }


  }


  reloadData() {
    this.isOpenAddEditDocumentType = false;
    this.getDocumentTypes();
  }

  closeModal() {
    this.isOpenAddEditDocumentType = false;
  }
  clearSearch() {
    this.searchForm.reset();
    this.getDocumentTypes();
  }

}
