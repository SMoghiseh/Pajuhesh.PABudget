import { Component, OnInit } from '@angular/core';
import {
  Pagination,
  AccountReport,
  UrlBuilder,
  PeriodBudgetType,
  ReportItemType,
  Company,
  AccountReportType,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'PABudget-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.scss'],
  providers: [ConfirmationService],
})
export class AccountReportComponent implements OnInit {
  addNewAccountReportForm!: FormGroup;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: AccountReport[] = [];
  reportTitleTypesList: any = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditReport = false;
  addEditData = new AccountReport();
  pId!: string;
  mode!: string;
  periodTypeList: any = [];
  reportTypeCodeList: any = [];
  companyList: any = [];

  get reportTypeCode() {
    return this.addNewAccountReportForm.get('reportTypeCode');
  }
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPeriodTypeList();
    this.getReportTypeCodeList();
    this.getCompanyLst();
    this.getReportTitleTypeList();

    this.addNewAccountReportForm = new FormGroup({
      title: new FormControl(null),
      reportTypeCode: new FormControl(null),
      periodTypeCode: new FormControl(null),
      basicReportTypeId: new FormControl(null),
      companyId: new FormControl(),
    });
  }

  getPeriodTypeList() {
    this.httpService
      // .get<any[]>(Period.apiAddress + 'ListDropDown')
      .get<any[]>(PeriodBudgetType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodTypeList = response.data.result;
        }
      });
  }
  getReportTypeCodeList() {
    this.httpService
      .get<any[]>(ReportItemType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.reportTypeCodeList = response.data.result;
        }
      });
  }

  getReportTitleTypeList() {
    this.httpService
      .get<any[]>(AccountReportType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.reportTitleTypesList = response.data.result;
        }
      });
  }
  // getReport(event?: LazyLoadEvent) {
  //   if (event) this.lazyLoadEvent = event;

  //   const pagination = new Pagination();
  //   const first = this.lazyLoadEvent?.first || 0;
  //   const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

  //   pagination.pageNumber = first / rows + 1;
  //   pagination.pageSize = rows;

  //   const body = {
  //     withOutPagination: false,
  //     pageSize: pagination.pageSize,
  //     pageNumber: pagination.pageNumber,
  //     ...this.addNewAccountReportForm.value
  //   };

  //   this.first = 0;
  //   const url = AccountReport.apiAddress + 'GetAllAccountReport';
  //   this.httpService
  //     .post<AccountReport[]>(url, body)

  //     .pipe(
  //       tap(() => (this.loading = false)),
  //       map(response => {
  //         if (response.data && response.data.result) {
  //           if (response.data.totalCount)
  //             this.totalCount = response.data.totalCount;
  //           return response.data.result;
  //         } else return [new AccountReport()];
  //       })
  //     )
  //     .subscribe(res => {
  //       this.data = res;
  //     });
  // }

  getAccountReportList(event?: any) {
    if (event) this.lazyLoadEvent = event;
    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.addNewAccountReportForm.value;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;
    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      title: formValue.title,
      reportTypeCode: formValue.reportTypeCode,
      periodTypeCode: formValue.periodTypeCode,
      companyId: formValue.companyId,
      basicReportTypeId: formValue.basicReportTypeId,
    };
    this.first = 0;
    const url = AccountReport.apiAddressList;
    this.httpService
      .post<AccountReport[]>(url, body)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new AccountReport()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  clearSearch() {
    this.addNewAccountReportForm.reset();
    this.getAccountReportList();
  }
  addReport() {
    this.modalTitle = 'افزودن  گزارش جدید';
    this.mode = 'insert';
    this.isOpenAddEditReport = true;
  }

  editRow(data: AccountReport) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditReport = true;
  }

  deleteRow(item: AccountReport) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.title} " اطمینان دارید؟`,
        header: `عنوان "${item.title}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteReport(item.id, item.title),
      });
  }

  deleteReport(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<AccountReport>(
          UrlBuilder.build(
            AccountReport.apiAddress + 'DeleteAccountReport',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'report',
              life: 8000,
              severity: 'success',
              detail: ` گزارش  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getAccountReportList();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditReport = false;
    this.getAccountReportList();
  }

  addAccountReportToItem(report: AccountReport) {
    this.router.navigate(['/Reports/AggregateCreate/' + report.id]);
  }

  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
}
