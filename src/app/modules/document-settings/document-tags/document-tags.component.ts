import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import {
  DocumentType,
  TagType,
  UrlBuilder,
  Subject,
} from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-document-tags-definition',
  templateUrl: './document-tags.component.html',
  styleUrls: ['./document-tags.component.scss'],
  providers: [ConfirmationService],
})
export class DocumentTagsComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table loading. */
  loading = false;

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewDocumentTagTypeForm!: FormGroup;

  addNewTagTypeModel = new TagType();

  tagsLst: TagType[] = [];

  DocumentsTagType: TagType[] = [];

  subjects: Subject[] = [];

  get tagTypeId() {
    return this.addNewDocumentTagTypeForm.get('tagTypeId');
  }

  get docTypeId() {
    return this.addNewDocumentTagTypeForm.get('docTypeId');
  }

  get tagName() {
    return this.addNewDocumentTagTypeForm.get('tagName');
  }
  get displayName() {
    return this.addNewDocumentTagTypeForm.get('displayName');
  }

  addNewDocumentTagTypeLoading = false;

  addNewDocumentTagTypeFormSubmitted = false;

  selectedTagType = new TagType();

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  nodes: any;

  selectedDocumentTypeId!: number;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getDocumentismentTypeTree();
    this.getTagsList();
    this.getSubjects();
    this.addNewDocumentTagTypeForm = new FormGroup({
      docTypeId: new FormControl(
        this.addNewTagTypeModel.docTypeId,
        Validators.required
      ),
      tagTypeId: new FormControl(
        this.addNewTagTypeModel.tagTypeId,
        Validators.required
      ),
      tagName: new FormControl(
        this.addNewTagTypeModel.tagName,
        Validators.required
      ),
      displayName: new FormControl(
        this.addNewTagTypeModel.displayName,
        Validators.required
      ),
      tagServiceMasterId: new FormControl(
        this.addNewTagTypeModel.tagServiceMasterId
      ),
      isRequired: new FormControl(this.addNewTagTypeModel.isRequired),
    });
  }

  onChangeTag(e: any) {
    debugger;
    this.tagTypeId;
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get documentTagTypes from server. */

  addOrUpdateDocumentTagType() {
    this.addNewDocumentTagTypeFormSubmitted = true;

    if (this.addNewDocumentTagTypeForm.valid) {
      this.addNewDocumentTagTypeLoading = true;

      const {
        docTypeId,
        tagTypeId,
        displayName,
        tagName,
        isRequired,
        tagServiceMasterId,
      } = this.addNewDocumentTagTypeForm.value;

      const request = new TagType();
      request.docTypeTagsId = this.selectedTagType.docTypeTagsId || 0;
      request.docTypeId = docTypeId?.key;
      request.tagTypeId = tagTypeId;
      request.tagName = tagName;
      request.displayName = displayName;
      request.isRequired = isRequired;
      request.tagServiceMasterId = tagServiceMasterId;

      const typeOpe = request.docTypeTagsId ? 'EDIT' : 'ADD';

      this.httpService
        .post<TagType>(UrlBuilder.build(TagType.apiAddress1, typeOpe), request)
        .pipe(
          tap(() => {
            this.addNewDocumentTagTypeLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getDocumentTypeTagsList(this.selectedDocumentTypeId);

            this.messageService.add({
              key: 'documentTagType',
              life: 8000,
              severity: 'success',
              detail: `تگ اسناد`,
              summary: 'با موفقیت درج شد',
            });

            this.resetaddNewDocumentTagTypeForm();
          }
        });
    }
  }

  editRow(TagType: TagType) {
    if (TagType.docTypeTagsId) {
      this.selectedTagType = TagType;
      if (typeof TagType.docTypeId == 'number')
        this.returnSelectedNode(
          TagType.docTypeId,
          this.nodes,
          TagType
        );
      else this.addNewDocumentTagTypeForm.patchValue(TagType);
    }
  }
  returnSelectedNode(key: number, list: any, rowData: any) {
    list.forEach((element: any) => {
      if (element.key == key) {
        rowData.docTypeId = element;
        this.addNewDocumentTagTypeForm.patchValue(rowData);
        return;
      } else if (element.children?.length > 0) {
        this.returnSelectedNode(key, element.children, rowData);
      } else return;
    });
  }

  deleteRow(TagType: TagType) {
    if (TagType && TagType.docTypeTagsId)
      this.confirmationService.confirm({
        message: 'آیا از حذف تگ اسناد اطمینان دارید؟',
        header: `نوع فایل ${TagType.tagName}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () =>
          this.deleteTagType(TagType.docTypeTagsId, TagType.tagName),
      });
  }

  deleteTagType(id: number, type: string) {
    if (id && type) {
      const body = {
        docTypeTagsId: id,
      };
      this.httpService
        .post<TagType>(UrlBuilder.build(TagType.apiAddress1, 'DELETE'), body)
        .subscribe(response => {
          if (response.successed) {
            this.getDocumentTypeTagsList(this.selectedDocumentTypeId);

            this.messageService.add({
              key: 'documentTagType',
              life: 8000,
              severity: 'success',
              detail: `تگ اسناد ${type}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetaddNewDocumentTagTypeForm();
          }
        });
    }
  }

  resetaddNewDocumentTagTypeForm() {
    this.addNewDocumentTagTypeFormSubmitted = false;
    this.addNewDocumentTagTypeForm.controls['tagTypeId'].reset();
    this.addNewDocumentTagTypeForm.controls['tagName'].reset();
    this.addNewDocumentTagTypeForm.controls['displayName'].reset();
    this.addNewDocumentTagTypeForm.controls['isRequired'].reset();
    // this.addNewDocumentTagTypeForm.reset();
    this.selectedTagType = new TagType();
  }

  getDocumentismentTypeTree() {
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
      .subscribe(documentismentTypes => (this.nodes = documentismentTypes));
  }

  getTagsList() {
    this.httpService
      .get<TagType[]>(UrlBuilder.build(TagType.apiAddress, 'LIST'))
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new TagType()];
        })
      )
      .subscribe(documentismentTypes => (this.tagsLst = documentismentTypes));
  }

  onNodeSelect() {
    this.getDocumentTypeTagsList(this.docTypeId?.value.key);
  }

  getDocumentTypeTagsList(documentTypeId: number) {
    this.selectedDocumentTypeId = documentTypeId;
    this.loading = true;
    this.httpService
      .get<TagType[]>(TagType.apiAddress1 + `/list/${documentTypeId}`)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new TagType()];
        })
      )
      .subscribe(
        documentismentTypes => (this.DocumentsTagType = documentismentTypes)
      );
  }

  getSubjects() {
    this.httpService
      .get<Subject[]>(UrlBuilder.build(Subject.apiAddress, 'LIST'))
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new Subject()];
        })
      )
      .subscribe(subjects => {
        this.subjects = subjects;
      });
  }
}
