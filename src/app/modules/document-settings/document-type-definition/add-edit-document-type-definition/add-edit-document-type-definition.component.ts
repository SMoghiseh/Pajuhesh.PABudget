import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  selector: 'PABudget-add-edit-document-type-definition',
  templateUrl: './add-edit-document-type-definition.component.html',
  styleUrls: ['./add-edit-document-type-definition.component.scss'],
})
export class AddEditDocumentTypeDefinitionComponent {
  addNewDocumentTypeForm!: FormGroup;
  addNewDocumentTypeModel = new DocumentType();
  addNewDocumentTypeFormSubmitted = false;
  documentTypesTree: DocumentType[] = [];
  selectedDocumentType = new DocumentType();
  addNewDocumentTypeLoading = false;
  loading = false;
  groupsLst!: DocumentTypeGroup[];
  periodTypeLst!: PeriodType[];
  inputData = new DocumentType();
  @Input() mode = '';
  @Input() set data1(data: DocumentType) {
    this.inputData = data;
  }
  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();

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
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
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
      periodTypeId: new FormControl(this.addNewDocumentTypeModel.periodTypeId),
    });
    if (this.mode === 'edit') {
      this.addNewDocumentTypeForm.patchValue(this.inputData);
    }
  }

  getDocumentTypesTree() {
    this.loading = true;
    this.httpService
      .get<DocumentType[]>(UrlBuilder.build(DocumentType.apiAddress, 'TREE'))
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new DocumentType()];
        })
      )
      .subscribe(documentTypes => (this.documentTypesTree = documentTypes));
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
            this.getDocumentTypesTree();
            this.messageService.add({
              key: 'documentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع اسناد`,
              summary:
                this.mode === 'insert'
                  ? 'با موفقیت درج شد'
                  : 'با موفقیت بروزرسانی شد',
            });

            this.isSuccess.emit(true);
          }
        });
    }
  }
  // resetAddNewDocumentTypeForm() {
  //   this.addNewDocumentTypeFormSubmitted = false;
  //   this.addNewDocumentTypeForm.reset();
  //   this.selectedDocumentType = new DocumentType();
  // }

  getGroups() {
    const body = {
      withOutPagination: false,
    };

    this.httpService
      .get<DocumentTypeGroup[]>(DocumentTypeGroup.apiAddress)
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
