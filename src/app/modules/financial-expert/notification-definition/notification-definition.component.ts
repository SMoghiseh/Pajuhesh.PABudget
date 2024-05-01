import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  AssetAttachment,
  Report,
  UrlBuilder,
  OnlineDocumentAttachmentNeeds,
  Publisher,
  TagType,
  FileType,
  AttachmentType,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';
import { MessageService } from 'primeng/api';
import { Subscription, map, of, tap } from 'rxjs';
import { AppConfigService } from '@core/services/app-config.service';
@Component({
  selector: 'app-notification-definition',
  templateUrl: './notification-definition.component.html',
  styleUrls: ['./notification-definition.component.scss'],
})
export class NotificationDefinitionComponent implements OnInit {
  /*--------------------------
  # Upload
  --------------------------*/
  /** موضوع اسناد */
  notificationSubject = '';

  /** سال مالی منتهی به */
  endDate!: JDate;

  /** حسابرسی شده */
  hasAudit = true;

  multimediaIdList: number[] = [];

  visible = false;

  selectedOnlineDoc: any;

  totalCount!: number;

  /** Main table data. */
  onlineDocAttachNeed: any;

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  tagsList: TagType[] = [];

  disableSubmitBtn = false;

  callAttach: Subscription[] = [];

  /*--------------------------
  # Form
  --------------------------*/
  addNewReportForm!: FormGroup;
  addNewFormModel = new Report();
  addNewFormLoading = false;
  addNewFormSubmitted = false;
  first = 0;

  get description() {
    return this.addNewReportForm.get('description');
  }
  get documentType() {
    return this.addNewReportForm.get('documentType');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService,
    private config: AppConfigService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    debugger
    this.addNewReportForm = new FormGroup({
      description: new FormControl(
        this.addNewFormModel.description,
        Validators.required
      ),
      documentType: new FormControl(
        { value: this.addNewFormModel.documentType, disabled: true },
        Validators.required
      ),
    });

    this.route.queryParams.subscribe((params: any) => {
      if (params.docTypeId) {
        const el = document.getElementsByClassName('AddDoc-pi pi-info');
        const elSelect = document.getElementsByClassName('e-select');
        if (elSelect.length > 0) {
          for (let i = 0; i < elSelect.length; i++) {
            elSelect[i].classList.remove('e-select');
          }
        }
        if (!el[0].querySelector('e-select')) el[0].classList.add('e-select');
        this.selectedOnlineDoc = {
          id: params.id,
          docTypeId: params.docTypeId,
        };
        this.addNewReportForm.patchValue({
          documentType: params.documentTypeName,
        });

        this.getOnlineDocument(params.docTypeId);
        this.getDocTypeTagsList(params.docTypeId);
      }
    });
  }

  /*--------------------------
  # Upload
  --------------------------*/

  onSelectAttachment(files: FileList, data: any, form: any) {
    const splt = files[0].name.split('.');
    if (splt[splt.length - 1].toUpperCase() == data.extention.toUpperCase())
      this.uploadAttachment(files, data);
    else {
      this.messageService.add({
        key: 'notificationDefinition',
        life: 8000,
        severity: 'error',
        detail: '',
        summary: 'فرمت فایل ارسالی صحیح نمیباشد',
      });
    }
    form.clear();
  }
  uploadAttachment(files: FileList, rowData: any) {
    this.disableSubmitBtn = true;
    const el = document.getElementById(
      'spinner_' + rowData.adverTyeFileNeedsId
    );
    el?.classList.add('spinner-display');
    if (files.length) {
      Array.from(files).forEach(file => {
        // let inputData: any;
        const data = new FormData();
        data.append('File', file);
        data.append('adverTyeFileNeedsId', rowData.adverTyeFileNeedsId);

        // inputData.OnlineDocNeedsInfoId = this.selectedOnlineDoc;

        if (file.size <= 25000000)
          return this.httpService
            .post<AssetAttachment>(AssetAttachment.apiAddress, data)
            .subscribe(response => {
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'notificationDefinition',
                  life: 8000,
                  severity: 'success',
                  detail: 'رسانه',
                  summary: 'با موفقیت بارگذاری شد',
                });
                this.multimediaIdList.push(response.data.result.multiMediaId);
                const el_fileUpload = document.getElementById(
                  'fileUpload_' + rowData.adverTyeFileNeedsId
                );
                const el_label =
                  el_fileUpload?.getElementsByClassName('p-button-label');
                el_label
                  ? (el_label[0].textContent = 'تغییر پیوست')
                  : 'افزودن پیوست';
              }
              el?.classList.add('spinner-not-display');
              this.disableSubmitBtn = false;
              rowData.isAttach = true;
            });
        else {
          el?.classList.add('spinner-not-display');
          this.disableSubmitBtn = false;
          this.messageService.add({
            key: 'notificationDefinition',
            life: 8000,
            severity: 'error',
            summary: 'حجم فایل ارسالی بیش از حد مجاز است',
          });
          return of();
        }
      });
    }
  }

  /*--------------------------
  # Form
  --------------------------*/
  addNewReport() {
    debugger
    this.addNewFormSubmitted = true;
    if (this.addNewReportForm.valid) {
      let isNotAttach = false;
      for (let i = 0; i < this.onlineDocAttachNeed.length; i++) {
        if (
          this.onlineDocAttachNeed[i].isRequired &&
          !this.onlineDocAttachNeed[i].isAttach
        ) {
          isNotAttach = true;
          this.messageService.add({
            key: 'notificationDefinition',
            life: 8000,
            severity: 'error',
            summary: 'لطفا تمامی فایل های اجباری را بارگذاری کنید',
          });
          break;
        }
      }
      if (!isNotAttach) {
        const { description } = this.addNewReportForm.value;

        const request = new Report();
        request.subject = description;
        request.description = description;
        request.onlineDocDefinitionId = this.selectedOnlineDoc?.id;
        request.docTypeId =
          this.selectedOnlineDoc?.docTypeId;
        request.multiMediaIds = this.multimediaIdList;
        this.addNewFormLoading = true;
        const tags: any[] = [];
        this.tagsList.forEach(element => {
          let val;
          if (element.typeName === 'Date') {
            val = this.jDateCalculatorService.convertToGeorgian(
              this.addNewReportForm
                .get(
                  element.tagName +
                  '_' +
                  element.typeName +
                  '_' +
                  element.docTypeTagsId
                )
                ?.value?.getFullYear(),
              this.addNewReportForm
                .get(
                  element.tagName +
                  '_' +
                  element.typeName +
                  '_' +
                  element.docTypeTagsId
                )
                ?.value?.getMonth(),
              this.addNewReportForm
                .get(
                  element.tagName +
                  '_' +
                  element.typeName +
                  '_' +
                  element.docTypeTagsId
                )
                ?.value?.getDate()
            );
          } else
            val = this.addNewReportForm
              .get(
                element.tagName +
                '_' +
                element.typeName +
                '_' +
                element.docTypeTagsId
              )
              ?.value.toString();
          tags.push({
            docTypeTagsId: element.docTypeTagsId,
            tagValue: val,
          });
        });
        request.tags = tags;
        const callAttach = this.httpService
          .post<Report[]>(
            UrlBuilder.build(Publisher.apiAddress + '/AddDoc', ''),
            request
          )
          .pipe(tap(() => (this.addNewFormLoading = false)))
          .subscribe(response => {
            if (response.successed) {
              this.messageService.add({
                key: 'notificationDefinition',
                life: 8000,
                severity: 'success',
                detail: `اسناد`,
                summary: 'با موفقیت تعریف شد',
              });

              this.resetAddNewReportForm();
              this.multimediaIdList = [];
              const x = document.getElementsByTagName('p-fileupload');
              for (let i = 0; x.length > i; i++) {
                const el_label = x[i]?.getElementsByClassName('p-button-label');
                el_label
                  ? (el_label[0].textContent = 'افزودن پیوست')
                  : 'تغییر پیوست';
              }
            }
          });
        this.callAttach.push(callAttach);
      }
    }
  }

  resetAddNewReportForm() {
    if (!this.callAttach) {
      return;
    }
    this.callAttach.forEach(s => s.unsubscribe());
    this.callAttach = [];
    this.disableSubmitBtn = false;
    this.addNewReportForm.reset();
    this.addNewFormSubmitted = false;
    this.onlineDocAttachNeed = [];
    this.tagsList = [];
  }

  onOpenTypesList() {
    this.visible = true;
  }

  onHide(event: any) {
    this.visible = false;
    this.selectedOnlineDoc = event;
    this.tagsList.forEach(element => {
      this.addNewReportForm.removeControl(
        element.tagName +
        '_' +
        element.typeName +
        '_' +
        element.docTypeTagsId
      );
    });

    this.addNewReportForm.patchValue({
      documentType: event?.documentTypeName,
    });

    this.getOnlineDocument(event.docTypeId);
    this.getDocTypeTagsList(event.docTypeId);
  }

  getOnlineDocument(Id: number) {
    debugger
    this.loading = true;
    this.first = 0;
    this.httpService
      .get<OnlineDocumentAttachmentNeeds[]>(
        OnlineDocumentAttachmentNeeds.apiAddress + `/list/${Id}`
      )
      .pipe(tap(() => (this.loading = false)))
      .subscribe(onlineDocAttachNeed => {
        console.log(onlineDocAttachNeed.data.result)
        this.onlineDocAttachNeed = onlineDocAttachNeed.data.result;
      });
  }

  getDocTypeTagsList(advertTypeId: number) {
    this.httpService
      .get<TagType[]>(TagType.apiAddress1 + `/list/${advertTypeId}`)
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new TagType()];
        })
      )
      .subscribe(documentTypes => {
        this.tagsList = documentTypes;
        documentTypes.forEach(element => {
          this.addNewReportForm.addControl(
            element.tagName +
            '_' +
            element.typeName +
            '_' +
            element.docTypeTagsId,
            new FormControl('', element.isRequired ? Validators.required : null)
          );
        });
        console.log(this.addNewReportForm);
      });
  }

  downloadAttachmnet(attachment: FileType) {
    const url =
      this.config.getAddress('baseUrl') +
      AttachmentType.apiAddress +
      `/Template/download/${attachment.attachmentFileTypeTemplateId}`;

    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
