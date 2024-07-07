import { Component } from '@angular/core';
import {
  Pagination,
  Sale,
  UrlBuilder,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  providers: [ConfirmationService],
})
export class SaleComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Sale[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditSale = false;
  addEditData = new Sale();
  pId!: string;
  mode!: string;

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {


  }

  getSale(event?: LazyLoadEvent) {
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

    this.loading = true;

    this.first = 0;
    const url = Sale.apiAddress + 'GetAllSales';
    this.httpService
      .post<Sale[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Sale()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addSale() {
    this.modalTitle = 'افزودن  نوع فروش جدید';
    this.mode = 'insert';
    this.isOpenAddEditSale = true;
  }

  editRow(data: Sale) {
    this.modalTitle = 'ویرایش ' + '"'+ data.budgetPeriodTitle + '-' + data.budgetPeriodDetailTitle + '"';
    this.getRowDataById(data.id);

  }

  getRowDataById(id: number) {
    this.httpService
      .get<Sale>(Sale.apiAddress + 'GetSaleById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.addEditData = response.data.result;
          this.mode = 'edit';
          this.isOpenAddEditSale = true;
        }
      });
  }

  deleteRow(period: Sale) {
    if (period && period.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${period.budgetPeriodTitle} - ${period.budgetPeriodDetailTitle}" اطمینان دارید؟`,
        header: `عنوان "${period.budgetPeriodTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteSale(period.id, period.budgetPeriodTitle),
      });
  }

  deleteSale(id: number, title: string) {
    if (id && title) {
      this.httpService
        .delete<Sale>(
          UrlBuilder.build(Sale.apiAddress + 'DeleteSale', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'sale',
              life: 8000,
              severity: 'success',
              detail: `نوع فروش  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getSale();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditSale = false;
    this.getSale();
  }
}
