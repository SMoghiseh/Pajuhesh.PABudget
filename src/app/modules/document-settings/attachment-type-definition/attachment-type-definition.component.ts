import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import { HttpClient } from '@angular/common/http';
import {
  AttachmentType,
  UrlBuilder,
  FileType,
  AssetAttachment,
} from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { map, of, tap } from 'rxjs';

@Component({
  selector: 'app-attachment-type-definition',
  templateUrl: './attachment-type-definition.component.html',
  styleUrls: ['./attachment-type-definition.component.scss'],
  providers: [ConfirmationService],
})
export class AttachmentTypeDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  attachmentTypes: AttachmentType[] = [];

  /** Main table loading. */
  loading = false;
  files: FileType[] = [];

  selectedFileTypeLbl = '';

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewAttachmentTypeForm!: FormGroup;

  addNewAttachmentTypeModel = new AttachmentType();

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  attachmentFileTypeTemplateId = 0;

  get title() {
    return this.addNewAttachmentTypeForm.get('title');
  }
  get enName() {
    return this.addNewAttachmentTypeForm.get('enName');
  }

  get tempPath() {
    return this.addNewAttachmentTypeForm.get('tempPath');
  }

  get fileMimeTypeId() {
    return this.addNewAttachmentTypeForm.get('fileMimeTypeId');
  }

  addNewAttachmentTypeLoading = false;

  addNewAttachmentTypeFormSubmitted = false;

  selectedAttachmentType = new AttachmentType();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private config: AppConfigService
  ) {}

  ngOnInit(): void {
    this.getAttachmentTypes();
    this.getFileTypes();
    this.addNewAttachmentTypeForm = new FormGroup({
      title: new FormControl(
        this.addNewAttachmentTypeModel.title,
        Validators.required
      ),
      enName: new FormControl(
        this.addNewAttachmentTypeModel.enName,
        Validators.required
      ),
      tempPath: new FormControl({ value: '', disabled: true }),
      fileMimeTypeId: new FormControl(
        this.addNewAttachmentTypeModel.fileMimeTypeId,
        Validators.required
      ),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get attachmentTypes from server. */
  getAttachmentTypes() {
    this.loading = true;

    this.httpService
      .get<AttachmentType[]>(
        UrlBuilder.build(AttachmentType.apiAddress, 'LIST')
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new AttachmentType()];
        })
      )
      .subscribe(attachmentTypes => (this.attachmentTypes = attachmentTypes));
  }

  addOrUpdateAttachmentType() {
    this.addNewAttachmentTypeFormSubmitted = true;

    if (this.addNewAttachmentTypeForm.valid) {
      this.addNewAttachmentTypeLoading = true;

      const { title, enName, tempPath, fileMimeTypeId } =
        this.addNewAttachmentTypeForm.value;

      const request = new AttachmentType();
      request.id = this.selectedAttachmentType.id || 0;
      request.title = title;
      request.enName = enName;
      request.tempPath = tempPath;
      request.fileMimeTypeId = fileMimeTypeId;
      request.attachmentFileTypeTemplateId =
        this.attachmentFileTypeTemplateId == 0
          ? null
          : this.attachmentFileTypeTemplateId;

      const typeOpe = request.id ? 'EDIT' : 'ADD';

      this.httpService
        .post<AttachmentType>(
          UrlBuilder.build(AttachmentType.apiAddress, typeOpe),
          request
        )
        .pipe(
          tap(() => {
            this.addNewAttachmentTypeLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getAttachmentTypes();

            this.messageService.add({
              key: 'attachmentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع پیوست`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewAttachmentTypeForm();
          }
        });
    }
  }

  editRow(fileType: AttachmentType) {
    if (fileType.id) {
      this.selectedAttachmentType = fileType;
      this.addNewAttachmentTypeForm.patchValue(fileType);
    }
  }

  deleteRow(fileType: AttachmentType) {
    if (fileType && fileType.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف نوع پیوست اطمینان دارید؟',
        header: `نوع پیوست ${fileType.title}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteAttachmentType(fileType.id, fileType.title),
      });
  }

  deleteAttachmentType(id: number, type: string) {
    if (id && type) {
      this.httpService
        .get<AttachmentType>(
          UrlBuilder.build(AttachmentType.apiAddress, 'REMOVE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.getAttachmentTypes();

            this.messageService.add({
              key: 'attachmentTypeDefinition',
              life: 8000,
              severity: 'success',
              detail: `نوع پیوست ${type}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewAttachmentTypeForm();
          }
        });
    }
  }

  resetAddNewAttachmentTypeForm() {
    this.addNewAttachmentTypeFormSubmitted = false;
    this.addNewAttachmentTypeForm.reset();
    this.selectedAttachmentType = new AttachmentType();
  }

  getFileTypes() {
    // this.httpService
    //   .get<FileType[]>(FileType.apiAddress, 'LIST')
    //   .subscribe(response => {
    //     if (response.data.result && response.data.result.length) {
    //       this.files = response.data.result;
    //       this.selectedFileType = response.data.result[0];
    //     }
    //   });

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
      .subscribe(fileTypes => (this.files = fileTypes));
  }

  // onSelectAttachment(files: FileList) {
  //   const splt = files[0].name.split('.');
  //   if (splt[splt.length - 1].toUpperCase() == data.extention.toUpperCase()) this.uploadAttachment(files, data);
  //   else {
  //     this.messageService.add({
  //       key: 'notificationDefinition',
  //       life: 8000,
  //       severity: 'error',
  //       detail: '',
  //       summary: 'فرمت فایل ارسالی صحیح نمیباشد',
  //     });
  //   }
  //   form.clear();
  // }

  uploadAttachment(files: FileList, form: any) {
    // const isExist = files[0].type.search(this.selectedFileTypeLbl);
    // if (isExist)
    //   this.messageService.add({
    //     key: 'attachmentTypeDefinition',
    //     life: 8000,
    //     severity: 'error',
    //     summary: 'فایل انتخاب شده با نوع فایل انتخابی مطابقت ندارد.',
    //   });
    // else {
    const fileName = files[0]?.name;
    if (files.length) {
      Array.from(files).forEach(file => {
        const data = new FormData();
        data.append('File', file);

        if (file.size <= 25000000)
          return this.httpService
            .post<any>(AssetAttachment.apiAddress, data)
            .subscribe(response => {
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'attachmentTypeDefinition',
                  life: 8000,
                  severity: 'success',
                  summary: 'فایل با موفقیت بارگذاری شد',
                });
                this.addNewAttachmentTypeForm.patchValue({
                  tempPath: fileName,
                });
                this.attachmentFileTypeTemplateId =
                  response.data.result.multiMediaId;
              }
            });
        else return of();
      });
    }
    // }
    form.clear();
  }

  downloadAttachmnet(attachment: FileType) {
    const url =
      this.config.getAddress('baseUrl') +
      AssetAttachment.download2ApiAddress +
      `${attachment.attachmentFileTypeTemplateId}`;

    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  downLoadFile(data: Blob, type: string, fileName: string) {
    const blob = new Blob([data], { type: type.toString() });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
  }

  onChangeFileType(e: any) {
    this.selectedFileTypeLbl = e.originalEvent.currentTarget.ariaLabel;
  }
}
