import { Component } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { BudgetSourceUse, Pagination } from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-budget-source-use',
  templateUrl: './budget-source-use.component.html',
  styleUrls: ['./budget-source-use.component.scss'],
  providers: [ConfirmationService],
})
export class BudgetSourceUseComponent {
  modalTitle = '';
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  isOpenAddEditBudgetSourceUse = false;
  lazyLoadEvent?: LazyLoadEvent;
  data: BudgetSourceUse[] = [];
  first = 0;
  loading = false;
  budget!: number;
  budgetDetail!: number;
  company!: number;
  title!: string;
  editDataDetails: BudgetSourceUse[] = [];
  addEditData = new BudgetSourceUse();
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  addBudgetSourceUse() {
    this.modalTitle = 'افزودن منابع و مصارف جدید';
    this.isOpenAddEditBudgetSourceUse = true;
    this.addEditData.type = 'insert';
  }

  reloadData() {
    this.isOpenAddEditBudgetSourceUse = false;
    this.getBudgetSourceUse();
  }

  getBudgetSourceUse(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;
    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;
    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
    };

    this.loading = true;
    this.first = 0;
    const url = BudgetSourceUse.apiAddressList;
    this.httpService
      .post<BudgetSourceUse[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new BudgetSourceUse()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  editRow(data: BudgetSourceUse) {
    this.modalTitle = 'ویرایش منابع و مصارف ';
    this.addEditData = data;
    this.addEditData.type = 'edit';
    this.isOpenAddEditBudgetSourceUse = true;
    // this.getResourceUseDetailLst(data.id);
  }
  deleteRow(budgetSourceUse: BudgetSourceUse) {
    if (budgetSourceUse && budgetSourceUse.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف  منابع و مصارف اطمینان دارید؟',
        header: `منابع و مصارف ${budgetSourceUse.sourceUseTypeTitle}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteBudgetSourceUse(budgetSourceUse.id),
      });
  }
  deleteBudgetSourceUse(id: number) {
    if (id) {
      this.httpService
        .get<BudgetSourceUse[]>(`${BudgetSourceUse.apiAddressDel}/${id}`, {})

        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'BudgetSourceUse',
              life: 8000,
              severity: 'success',
              detail: `کد منابع و مصارف ${id}`,
              summary: 'با موفقیت حذف شد',
            });

            this.getBudgetSourceUse();
          }
        });
    }
  }
}
