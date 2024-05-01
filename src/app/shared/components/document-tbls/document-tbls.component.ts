import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ReportAttachment,
  UrlBuilder,
  Report,
  Publisher,
  AttachmentsType,
  Attachments,
  Asset,
  AdvertStatusHistory,
  SupervisorSearch,
  OnlineDocumentAttachmentNeeds,
  TagType,
  AssetAttachment,
} from '@shared/models/response.model';
import { map, of, tap } from 'rxjs';
import { HttpService } from '@core/http/http.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TransferServices } from '../../../config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '@core/services/app-config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { JDate } from '@shared/utilities/JDate/jdate';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-document-tbls',
  templateUrl: './document-tbls.component.html',
  styleUrls: ['./document-tbls.component.scss'],
})
export class DocumentTblsComponent implements OnInit {
  /** Main table rows */
  dataTableRows = 15;

  gridClass = 'p-datatable-sm';

  /** Table data total count. */
  totalCount!: number;

  // /** Main table loading. */
  loading = false;

  first = 0;

  loginData: any;

  /** Selected report model */
  selectedReport = new Report();

  /** Preview details state. */
  previewDetailsDialog = false;

  /** Preview attachments state. */
  previewAttachmentsLoading = false;

  /** Preview attachments state. */
  reportAttachment!: ReportAttachment;

  /** Preview attachments state. */
  previewAttachmentsDialog = false;

  selectedRowData!: Report;

  isOpenEditTags = false;

  /** Attachment types */
  attachmentType = AttachmentsType;

  lazyLoadEvent?: LazyLoadEvent;

  emptyInput = new Publisher();

  /** Main table data. */
  reportList: Publisher[] = [];

  actionType: any;

  previewConfirmationDialog = false;

  rejectReportForm!: FormGroup;

  rejectReportFormSubmitted = false;

  addAmendmentFormSubmitted = false;

  rejectedReason!: string;

  workflowList!: AdvertStatusHistory[];

  isShowWorkflowDialog = false;

  registerAmendmentDialog = false;

  onlineDocumentLoading = false;

  onlineAdvertAttachNeeds: any;

  addAmendmentForm!: FormGroup;

  multimediaIdList: number[] = [];

  addAmendmentLoading = false;

  tagsList: TagType[] = [];

  isAccessRegisterAmendment = false;
  isAccessEditTag = false;

  isAccessPreviewConfirmation = false;

  isAccessWorkflow = false;

  isDisableaddAmendmentBtn = false;

  pdfViewerDialog = false;

  srcPath: any = [];

  searchData: any = [];

  rejectReportModel: { reason: string } = { reason: '' };
  addAmendmentModel: { reason: string; description: string } = {
    reason: '',
    description: '',
  };

  @ViewChild('dataTable') dataTable!: Table;

  @Input() apiUrl = '';
  @Input() accessToActions: Array<string> = [];
  @Input() type = '';

  private _data: any;
  @Input() set data(val: any) {
    if (val) {
      let page: any;
      if (
        this.searchData &&
        this.searchData.docTypeId &&
        val?.docTypeId !== this.searchData?.docTypeId
      ) {
        page = {
          first: 0,
          rows: this.dataTableRows,
        };
        this.dataTable.reset();
      }
      this.searchData = val;
      this.getReportList(val, page);
    }
  }
  get data() {
    return this._data;
  }

  get reason() {
    return this.rejectReportForm.get('reason');
  }
  get reasonAmendment() {
    return this.addAmendmentForm.get('reason');
  }

  get description() {
    return this.addAmendmentForm.get('description');
  }

  constructor(
    private httpService: HttpService,
    private transferServices: TransferServices,
    private jDateCalculatorService: JDateCalculatorService,
    private messageService: MessageService,
    private config: AppConfigService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const loginData = localStorage.getItem('loginData');
    this.loginData = loginData ? JSON.parse(loginData) : {};

    this.isAccessEditTag = this.returnAccess('edit-tag');

    this.isAccessPreviewConfirmation = this.returnAccess(
      'preview-confirmation'
    );
    this.isAccessWorkflow = this.returnAccess('workflow');

    this.isAccessRegisterAmendment = this.returnAccess('register-amendment');

    this.rejectReportForm = new FormGroup({
      reason: new FormControl(
        this.rejectReportModel.reason,
        Validators.required
      ),
    });

    this.addAmendmentForm = new FormGroup({
      reason: new FormControl(
        this.addAmendmentModel.reason,
        Validators.required
      ),
      description: new FormControl(this.addAmendmentModel.description),
    });
  }

  previewDetails(report: Report) {
    if (!report.code && report.docTypeCode)
      report.code = report.docTypeCode;
    this.selectedReport = report;
    this.previewDetailsDialog = true;
  }

  previewAttachments(data: Report) {
    if (data.id || data.docId) {
      const id = data.docId ? data.docId : data.id;
      this.previewAttachmentsLoading = true;

      this.httpService
        .get<ReportAttachment>(
          UrlBuilder.build(Report.apiAddress + '/' + id, 'ATTACHMENTS')
        )
        .pipe(
          tap(() => (this.previewAttachmentsLoading = false)),
          map(response => {
            if (response.data && response.data.result)
              return response.data.result;
            else return new ReportAttachment();
          })
        )
        .subscribe(reportAttachment => {
          this.reportAttachment = reportAttachment;
          this.previewAttachmentsDialog = true;
        });
    }
  }

  editTags(rowData: Report) {
    this.selectedRowData = rowData;
    this.isOpenEditTags = true;
  }

  downloadAttachmnet(attachment: Attachments) {
    if (attachment.id) {
      this.httpService
        .getFile(
          UrlBuilder.build(Asset.apiAddress + `/${attachment.id}`, 'DOWNLOAD')
        )
        .subscribe(reponse =>
          this.downLoadFile(reponse, attachment.mimeType, attachment.fileName)
        );
    }
  }

  downLoadFile(data: Blob, type: string, fileName: string) {
    const blob = new Blob([data], { type: type.toString() });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
  }

  onfirstChange(f: number) {
    this.first = f;
    const page = {
      first: f,
      rows: this.dataTableRows,
    };
    this.getReportList(this.searchData, page);
  }

  onRowsChange(rows: number) {
    this.dataTableRows = rows;
    const page = {
      first: this.first,
      rows: this.dataTableRows,
    };
    this.getReportList(this.searchData, page);
  }

  getReportList(searchModel = new Publisher(), event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;
    else this.first = 0;

    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<Publisher[]>(this.apiUrl, searchModel)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.totalCount != undefined)
            this.totalCount = response.data.totalCount;
          if (response.data && response.data.result)
            return response.data.result;
          else return [];
        })
      )
      .subscribe(reportList => {
        reportList.forEach(element1 => {
          if (element1.docStatus === 3)
            element1.docStatusTitle = 'برگشت داده شده';
          if (element1.docStatus === 2)
            element1.docStatusTitle = 'تحت احتیاط';
          if (element1.docStatus === 1)
            element1.docStatusTitle = 'تایید شده';
          if (element1.docStatus === 0)
            element1.docStatusTitle = 'بررسی نشده';
          if (element1.tags.length > 0) {
            element1.tags.forEach((element2: any) => {
              if (element2.typeName == 'Date') {
                element2.dateTag = element2.tagValue;
                element1.dateTag =
                  element2.displayName + ' : ' + element2.tagValue;
              }
            });
          }
        });
        this.reportList = reportList;
      });
  }

  returnAccess(action: string): boolean {
    const tmp = this.accessToActions.find(x => x === action);
    if (tmp) return true;
    else return false;
  }

  previewConfirmation(report: Report) {
    this.rejectReportFormSubmitted = false;
    this.selectedReport = report;
    this.actionType = null;
    this.rejectReportForm.reset();
    this.previewConfirmationDialog = true;
  }

  confirmReport() {
    if (this.actionType === 'REFFER' || this.actionType === 'REJECT')
      this.rejectReportFormSubmitted = true;
    if (
      this.actionType === 'APPROVE' ||
      (this.rejectReportForm.valid &&
        (this.actionType === 'REFFER' || this.actionType === 'REJECT'))
    ) {
      // if((this.actionType==='REFFER'||this.actionType==='REJECT')&&)
      const body = {
        docId: this.selectedReport.docId,
        workFlowId: this.selectedReport.id,
        comment: this.rejectReportForm.get('reason')?.value,
      };
      this.httpService
        .post<SupervisorSearch>(
          UrlBuilder.build(SupervisorSearch.apiAddress, this.actionType),
          body
        )
        .subscribe(response => {
          if (response.successed) {
            this.previewConfirmationDialog = false;
            this.getReportList();
            this.messageService.add({
              key: 'confirmationDefinition',
              life: 8000,
              severity: 'success',
              // detail: `تایید اسناد`,
              summary: 'عملیات با موفقیت انجام شد',
            });
          }
        });
    }
  }

  closeConfirmationDialog() {
    this.previewConfirmationDialog = false;
    this.rejectedReason = '';
  }

  onWorkflow(report: Report) {
    this.httpService
      .get<AdvertStatusHistory[]>(
        AdvertStatusHistory.apiAddress + '/' + report.docId
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [];
        })
      )
      .subscribe(workflowList => (this.workflowList = workflowList));
    this.isShowWorkflowDialog = true;
  }

  onClick(e: any) {
    const tmp =
      e.currentTarget.parentElement.parentElement.getElementsByClassName(
        'customComment'
      );
    tmp[0].style.display = tmp[0].style.display == 'unset' ? 'none' : 'unset';
  }

  registerAmendment(report: Report) {
    if (this.tagsList.length > 0) {
      this.tagsList.forEach(element => {
        this.addAmendmentForm.removeControl(
          element.tagName +
          '_' +
          element.typeName +
          '_' +
          element.docTypeTagsId
        );
      });
    }
    this.addAmendmentForm.patchValue(report);
    this.getOnlineDocument(report.docTypeId);
    this.getAdvertTypeTagsList(report.id);
    this.selectedReport = report;
    this.registerAmendmentDialog = true;
  }

  closeRegisterAmendment() {
    this.registerAmendmentDialog = false;
    this.rejectedReason = '';
    this.getReportList(this.searchData);
  }

  getOnlineDocument(Id: any) {
    this.onlineDocumentLoading = true;
    this.httpService
      .get<OnlineDocumentAttachmentNeeds[]>(
        OnlineDocumentAttachmentNeeds.apiAddress + `/list/${Id}`
      )
      .pipe(tap(() => (this.onlineDocumentLoading = false)))
      .subscribe(onlineAdvertAttachNeeds => {
        this.onlineAdvertAttachNeeds = onlineAdvertAttachNeeds.data.result;
      });
  }

  addAmendment(reportId: number) {
    this.addAmendmentFormSubmitted = true;
    if (
      this.addAmendmentForm.valid &&
      ((this.selectedReport.docStatus === 3 &&
        this.addAmendmentForm.controls['description'].value !== '') ||
        this.selectedReport.docStatus !== 3)
    ) {
      let isNotAttach = false;
      for (let i = 0; i < this.onlineAdvertAttachNeeds.length; i++) {
        if (
          this.onlineAdvertAttachNeeds[i].isRequired &&
          !this.onlineAdvertAttachNeeds[i].isAttach
        ) {
          isNotAttach = true;
          this.messageService.add({
            key: 'myDocuments',
            life: 8000,
            severity: 'error',
            summary: 'لطفا تمامی فایل های اجباری را بارگذاری کنید',
          });
          break;
        }
      }
      if (!isNotAttach) {
        let apiUrl = '';
        const { reason, description } = this.addAmendmentForm.value;
        const request = new Report();
        request.docId = reportId;
        request.amendmentReason = reason;
        request.multiMediaIds = this.multimediaIdList;
        if (this.selectedReport.docStatus === 3) {
          apiUrl = '/EditDoc';
          request.description = description;
          request.subject = description;
        } else apiUrl = '/ResendDoc';
        this.addAmendmentLoading = true;
        const tags: any[] = [];
        this.tagsList.forEach(element => {
          let val;
          if (element.typeName === 'Date') {
            val = this.jDateCalculatorService.convertToGeorgian(
              this.addAmendmentForm
                .get(
                  element.tagName +
                  '_' +
                  element.typeName +
                  '_' +
                  element.docTypeTagsId
                )
                ?.value?.getFullYear(),
              this.addAmendmentForm
                .get(
                  element.tagName +
                  '_' +
                  element.typeName +
                  '_' +
                  element.docTypeTagsId
                )
                ?.value?.getMonth(),
              this.addAmendmentForm
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
            val = this.addAmendmentForm
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

        this.httpService
          .post<Report[]>(
            UrlBuilder.build(Publisher.apiAddress + apiUrl, ''),
            request
          )
          .pipe(tap(() => (this.addAmendmentLoading = false)))
          .subscribe(response => {
            if (response.successed) {
              this.messageService.add({
                key: 'myDocuments',
                life: 8000,
                severity: 'success',
                detail: `اصلاحیه`,
                summary: 'با موفقیت ثبت شد',
              });

              this.closeRegisterAmendment();
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
      }
    }
  }

  getAdvertTypeTagsList(id: number) {
    this.httpService
      .get<TagType[]>(TagType.apiAddressTags2 + `/DocTagsWithNeed/${id}`)
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
          this.addAmendmentForm.addControl(
            element.tagName +
            '_' +
            element.typeName +
            '_' +
            element.docTypeTagsId,
            new FormControl(
              element.typeName !== 'Date'
                ? element.tagValue
                : new JDate(new Date(element.tagValue)),
              element.isRequired ? Validators.required : null
            )
          );
        });
      });
  }

  onHideAddAmendment() {
    this.addAmendmentForm.reset();
    this.addAmendmentFormSubmitted = false;
  }

  onSelectAttachment(files: FileList, data: any, form: any) {
    this.isDisableaddAmendmentBtn = true;
    const splt = files[0].name.split('.');
    if (splt[splt.length - 1].toUpperCase() == data.extention.toUpperCase())
      this.uploadAttachment(files, data);
    else {
      this.messageService.add({
        key: 'myDocuments',
        life: 8000,
        severity: 'error',
        detail: '',
        summary: 'فرمت فایل ارسالی صحیح نمیباشد',
      });
      this.isDisableaddAmendmentBtn = false;
    }
    form.clear();
  }

  uploadAttachment(files: FileList, rowData: any) {
    const el = document.getElementById(
      'spinner_' + rowData.adverTyeFileNeedsId
    );
    el?.classList.add('spinner-display');
    if (files.length) {
      Array.from(files).forEach(file => {
        const data = new FormData();
        data.append('File', file);
        data.append('adverTyeFileNeedsId', rowData.adverTyeFileNeedsId);

        if (file.size <= 25000000)
          return this.httpService
            .post<AssetAttachment>(AssetAttachment.apiAddress, data)
            .subscribe(response => {
              this.isDisableaddAmendmentBtn = false;
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'myDocuments',
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
              rowData.isAttach = true;
            });
        else {
          this.isDisableaddAmendmentBtn = false;
          el?.classList.add('spinner-not-display');
          this.messageService.add({
            key: 'myDocuments',
            life: 8000,
            severity: 'error',
            summary: 'حجم فایل ارسالی بیش از حد مجاز است',
          });
          return of();
        }
      });
    }
  }

  onClickPdfViewer(attachment: Attachments) {
    const slc = attachment.fileLocation.slice(
      17,
      attachment.fileLocation.length
    );
    this.srcPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.config.getAddress('baseUrl') + slc
    );
    this.pdfViewerDialog = true;
  }
}
