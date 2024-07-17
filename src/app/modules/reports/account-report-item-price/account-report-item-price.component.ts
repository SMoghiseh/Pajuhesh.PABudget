import { Component, OnInit } from '@angular/core';
import { Pagination, AccountReportItemPrice, UrlBuilder, Period, Company } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'PABudget-account-report',
  templateUrl: './account-report-item-price.component.html',
  styleUrls: ['./account-report-item-price.component.scss'],
  providers: [ConfirmationService]
})

export class AccountReportItemPriceComponent implements OnInit {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: AccountReportItemPrice[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditReport = false;
  addEditData = new AccountReportItemPrice();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  companyList: any = [];
  periodList: any = [];
  periodDetailLst: Period[] = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCompanyLst();

    this.searchForm = new FormGroup({
      companyId: new FormControl(0),
      periodId: new FormControl(0),
      fromPeriodDetailId: new FormControl(0),
      toPeriodDetailId: new FormControl(0),
    });

  }

  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodList = response.data.result;
        }
      });
  }

  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  onChangePeriod(e: any) {
    this.getPeriodDetailLst(e.value);
  }

  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailLst = response.data.result;
        }
      });
  }

  search() {

  }

  getReport(event?: LazyLoadEvent) {
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
      ...formValue
    };

    this.first = 0;
    const url = AccountReportItemPrice.apiAddress + 'GetAllAccountReposrtItemPrices';
    this.httpService
      .post<AccountReportItemPrice[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new AccountReportItemPrice()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addReport() {
    this.modalTitle = 'افزودن  گزارش جدید';
    this.mode = 'insert';
    this.isOpenAddEditReport = true;
  }

  editRow(data: AccountReportItemPrice) {
    this.modalTitle = 'ویرایش ' + '"' + data.reportItemTitle + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditReport = true;
  }

  deleteRow(item: AccountReportItemPrice) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.reportItemTitle} " اطمینان دارید؟`,
        header: `عنوان "${item.reportItemTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteReport(item.id, item.reportItemTitle),
      });
  }

  deleteReport(id: number, title: string) {
    if (id && title) {
      this.httpService
        .delete<AccountReportItemPrice>(
          UrlBuilder.build(AccountReportItemPrice.apiAddress + 'DeleteAccountReportItemPrice', '') + `/${id}`
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
            this.getReport();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditReport = false;
    this.getReport();
  }

  clearSearch(){
    this.searchForm.reset();
    this.getReport();
  }
}
