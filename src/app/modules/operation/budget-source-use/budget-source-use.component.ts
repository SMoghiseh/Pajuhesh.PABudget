import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  BudgetSourceUse,
  Company,
  Pagination,
  Period,
} from '@shared/models/response.model';
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
export class BudgetSourceUseComponent implements OnInit {
  addNewBudgetSourceUseForm!: FormGroup;
  modalTitle = '';
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  isOpenAddEditBudgetSourceUse = false;
  lazyLoadEvent?: LazyLoadEvent;
  data: BudgetSourceUse[] = [];
  first = 0;
  periodLst: Period[] = [];
  inputData = new BudgetSourceUse();
  loading = false;
  periodDetailLst: Period[] = [];
  budget!: number;
  companyList: any = [];
  budgetDetail!: number;
  company!: number;
  title!: string;
  sourceUseTypeList: BudgetSourceUse[] = [];
  addEditBudgetSourceUseModel = new BudgetSourceUse();
  editDataDetails: BudgetSourceUse[] = [];
  addEditData = new BudgetSourceUse();
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCompanyLst();
    this.getResourceUseType();
    this.addNewBudgetSourceUseForm = new FormGroup({
      budgetPeriodId: new FormControl(
        this.addEditBudgetSourceUseModel.budgetPeriodId
      ),
      budgetPeriodDetailId: new FormControl(
        this.addEditBudgetSourceUseModel.budgetPeriodDetailId
      ),
      companyId: new FormControl(this.addEditBudgetSourceUseModel.companyId),
      sourceUseTypeTitle: new FormControl(
        this.addEditBudgetSourceUseModel.sourceUseTypeTitle
      ),
    });
  }
  getBudgetSourceList(event?: any) {
    if (event) this.lazyLoadEvent = event;
    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.addNewBudgetSourceUseForm.value;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;
    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      budgetPeriodId: formValue.budgetPeriodId,
      budgetPeriodDetailId: formValue.budgetPeriodDetailId,
      companyId: formValue.companyId,
      title: formValue.sourceUseTypeTitle,
    };
    // if (!formValue.budgetPeriodId) return;
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
  addBudgetSourceUse() {
    this.modalTitle = 'افزودن منابع و مصارف جدید';
    this.isOpenAddEditBudgetSourceUse = true;
    this.addEditData.type = 'insert';
  }

  reloadData() {
    this.isOpenAddEditBudgetSourceUse = false;
    this.getBudgetSourceUse();
  }
  getResourceUseType() {
    this.httpService
      .get<BudgetSourceUse[]>(BudgetSourceUse.apiAdressResourceUse)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.sourceUseTypeList = response.data.result;
        }
      });
  }
  closeModal() {
    this.isOpenAddEditBudgetSourceUse = false;
  }
  onChangeResourceUse(e: any) {
    this.getPeriodDetailLst(e.value);
  }
  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodLst = response.data.result;
        }
      });
  }
  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailLst = response.data.result;
          if (this.inputData.id)
            this.addNewBudgetSourceUseForm.patchValue({
              budgetPeriodDetailId: this.inputData.budgetPeriodDetailId,
            });
        }
      });
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
    this.modalTitle =
      'ویرایش منابع و مصارف ' + '"' + data.sourceUseTypeTitle + '"';
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
  clearSearch() {
    this.addNewBudgetSourceUseForm.reset();
    this.getBudgetSourceList();
  }
}
