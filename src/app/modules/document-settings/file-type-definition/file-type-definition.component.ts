import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import { FileType, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'marketwatch-file-type-definition',
  templateUrl: './file-type-definition.component.html',
  styleUrls: ['./file-type-definition.component.scss'],
  providers: [ConfirmationService],
})
export class FileTypeDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  fileTypes: FileType[] = [];

  /** Main table loading. */
  loading = false;

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewFileTypeForm!: FormGroup;

  addNewFileTypeModel = new FileType();

  get type() {
    return this.addNewFileTypeForm.get('type');
  }
  get extention() {
    return this.addNewFileTypeForm.get('extention');
  }

  get description() {
    return this.addNewFileTypeForm.get('description');
  }

  addNewFileTypeLoading = false;

  addNewFileTypeFormSubmitted = false;

  selectedFileType = new FileType();

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getFileTypes();
    this.addNewFileTypeForm = new FormGroup({
      type: new FormControl(this.addNewFileTypeModel.type, Validators.required),
      extention: new FormControl(
        this.addNewFileTypeModel.extention,
        Validators.required
      ),
      description: new FormControl(
        this.addNewFileTypeModel.description,
        Validators.required
      ),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get fileTypes from server. */
  getFileTypes() {
    this.loading = true;

    this.httpService
      .get<FileType[]>(UrlBuilder.build(FileType.apiAddress, 'LIST'))
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new FileType()];
        })
      )
      .subscribe(fileTypes => (this.fileTypes = fileTypes));
  }

  addOrUpdateFileType() {
    this.addNewFileTypeFormSubmitted = true;

    if (this.addNewFileTypeForm.valid) {
      this.addNewFileTypeLoading = true;

      const { extention, type, description } = this.addNewFileTypeForm.value;

      const request = new FileType();
      request.id = this.selectedFileType.id || 0;
      request.type = type;
      request.extention = extention;
      request.description = description;

      const typeOpe = request.id ? 'EDIT' : 'ADD';

      this.httpService
        .post<FileType>(UrlBuilder.build(FileType.apiAddress, typeOpe), request)
        .pipe(
          tap(() => {
            this.addNewFileTypeLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getFileTypes();

            this.messageService.add({
              key: 'fileTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع فایل`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewFileTypeForm();
          }
        });
    }
  }

  editRow(fileType: FileType) {
    if (fileType.id) {
      this.selectedFileType = fileType;
      this.addNewFileTypeForm.patchValue(fileType);
    }
  }

  deleteRow(fileType: FileType) {
    if (fileType && fileType.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف نوع فایل اطمینان دارید؟',
        header: `نوع فایل ${fileType.type}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteFileType(fileType.id, fileType.type),
      });
  }

  deleteFileType(id: number, type: string) {
    if (id && type) {
      this.httpService
        .delete<FileType>(
          UrlBuilder.build(FileType.apiAddress, 'REMOVE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.getFileTypes();

            this.messageService.add({
              key: 'fileTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع فایل ${type}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewFileTypeForm();
          }
        });
    }
  }

  resetAddNewFileTypeForm() {
    this.addNewFileTypeFormSubmitted = false;
    this.addNewFileTypeForm.reset();
    this.selectedFileType = new FileType();
  }
}
