import { Component, OnInit } from '@angular/core';
import { Pagination, AccountReportToItem, UrlBuilder, Company, AccountReport } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'PABudget-account-report',
  templateUrl: './account-report-to-item.component.html',
  styleUrls: ['./account-report-to-item.component.scss'],
  providers: [ConfirmationService]
})

export class AccountReportToItemComponent implements OnInit {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: AccountReportToItem[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditReport = false;
  addEditData = new AccountReportToItem();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  companyList: any = [];
  accountReportList: any = [];

  isInFilteredMode = false;

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAccountReportLst();
    this.getCompanyLst();

    this.searchForm = new FormGroup({
      companyId: new FormControl(0),
      accountReportId: new FormControl(0),
    });

    this.route.params.subscribe((param: any) => {
      if (param.id) {
        this.isInFilteredMode = true;
        this.searchForm.value.accountReportId = param.id;
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

  getAccountReportLst() {
    this.httpService
      .post<AccountReport[]>(AccountReport.apiAddress + 'GetAllAccountReport', { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportList = response.data.result;
        }
      });
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
    const url = AccountReportToItem.apiAddress + 'GetAccountRepToItemList';
    this.httpService
      .post<AccountReportToItem[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new AccountReportToItem()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addReport() {
    this.modalTitle = 'افزودن  گزارش جدید';
    this.isOpenAddEditReport = true;
    this.mode = 'insert';
  }

  deleteRow(item: AccountReportToItem) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.accountRepTitle} " اطمینان دارید؟`,
        header: `عنوان "${item.accountRepTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteReport(item.id, item.accountRepTitle),
      });
  }

  deleteReport(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<AccountReportToItem>(
          UrlBuilder.build(AccountReportToItem.apiAddress + 'Delete', '') + `/${id}`
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

  clearSearch() {
    this.searchForm.reset();
    this.getReport();
  }
}
