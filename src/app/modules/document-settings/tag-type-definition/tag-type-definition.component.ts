import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import { TagType, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'app-tag-type-definition',
  templateUrl: './tag-type-definition.component.html',
  styleUrls: ['./tag-type-definition.component.scss'],
  providers: [ConfirmationService],
})
export class TagTypeDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  tagTypes: TagType[] = [];

  /** Main table loading. */
  loading = false;

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewTagTypeForm!: FormGroup;

  addNewTagTypeModel = new TagType();

  get name() {
    return this.addNewTagTypeForm.get('name');
  }
  get typeName() {
    return this.addNewTagTypeForm.get('typeName');
  }

  addNewTagTypeLoading = false;

  addNewTagTypeFormSubmitted = false;

  selectedTagType = new TagType();

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getTagTypes();
    this.addNewTagTypeForm = new FormGroup({
      name: new FormControl(this.addNewTagTypeModel.name, Validators.required),
      typeName: new FormControl(
        this.addNewTagTypeModel.typeName,
        Validators.required
      ),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get tagTypes from server. */
  getTagTypes() {
    this.loading = true;

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
      .subscribe(tagTypes => (this.tagTypes = tagTypes));
  }

  addOrUpdateTagType() {
    this.addNewTagTypeFormSubmitted = true;

    if (this.addNewTagTypeForm.valid) {
      this.addNewTagTypeLoading = true;

      const { typeName, name } = this.addNewTagTypeForm.value;

      const request = new TagType();
      request.tagTypeId = this.selectedTagType.id || 0;
      request.name = name;
      request.typeName = typeName;

      const typeOpe = request.tagTypeId ? 'EDIT' : 'ADD';

      this.httpService
        .post<TagType>(UrlBuilder.build(TagType.apiAddress, typeOpe), request)
        .pipe(
          tap(() => {
            this.addNewTagTypeLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getTagTypes();

            this.messageService.add({
              key: 'tagTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع تگ`,
              summary: 'با موفقیت درج شد',
            });

            this.resetaddNewTagTypeForm();
          }
        });
    }
  }

  editRow(TagType: TagType) {
    if (TagType.id) {
      this.selectedTagType = TagType;
      this.addNewTagTypeForm.patchValue(TagType);
    }
  }

  deleteRow(TagType: TagType) {
    if (TagType && TagType.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف نوع تگ اطمینان دارید؟',
        header: `نوع فایل ${TagType.name}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteTagType(TagType.id, TagType.name),
      });
  }

  deleteTagType(id: number, type: string) {
    if (id && type) {
      const body = {
        tagTypeId: id,
      };
      this.httpService
        .post<TagType>(UrlBuilder.build(`${TagType.apiAddress}/delete/${id}`, ''), {})
        .subscribe(response => {
          if (response.successed) {
            this.getTagTypes();

            this.messageService.add({
              key: 'tagTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع تگ ${type}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetaddNewTagTypeForm();
          }
        });
    }
  }

  resetaddNewTagTypeForm() {
    this.addNewTagTypeFormSubmitted = false;
    this.addNewTagTypeForm.reset();
    this.selectedTagType = new TagType();
  }
}
