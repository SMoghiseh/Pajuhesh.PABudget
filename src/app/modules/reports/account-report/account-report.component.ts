import { Component } from '@angular/core';
import { Pagination, AccountReport, UrlBuilder } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'PABudget-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.scss'],
  providers: [ConfirmationService]

})
export class AccountReportComponent {

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: AccountReport[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditReport = false;
  addEditData = new AccountReport();
  pId!: string;
  mode!: string;

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {


  }

  getReport(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber
    };

    this.first = 0;
    const url = AccountReport.apiAddress + 'GetAllAccountReport';
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
      .subscribe(res => {
        this.data = res;
      });
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
          UrlBuilder.build(AccountReport.apiAddress + 'DeleteAccountReport', '') + `/${id}`
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

  addAccountReportToItem(report:AccountReport) {
    this.router.navigate(['/Reports/AccountReportToItem/' + report.id]);
  }

}

