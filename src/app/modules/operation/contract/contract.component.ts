import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Contract,
  ContractNo,
  Pagination,
  UrlBuilder,
} from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [ConfirmationService],
})
export class ContractComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: ContractNo[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditContractlNo = false;
  addEditData = new ContractNo();
  editDataDetails: Contract[] = [];
  pId!: string;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  addContractlNo() {
    this.modalTitle = 'افزودن قرارداد جدید';
    this.isOpenAddEditContractlNo = true;
    this.addEditData.type = 'insert';
  }
  getContractlNo(event?: LazyLoadEvent) {
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
      periodId: parseInt(this.pId),
    };

    this.loading = true;
    this.first = 0;
    const url = ContractNo.adiAddressList;
    this.httpService
      .post<ContractNo[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new ContractNo()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  reloadData() {
    this.isOpenAddEditContractlNo = false;
    this.getContractlNo();
  }

  deleteRow(contractNo: ContractNo) {
    if (contractNo && contractNo.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف  قرارداد اطمینان دارید؟',
        header: `قرارداد ${contractNo.id}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteContractNo(contractNo.id),
      });
  }
  deleteContractNo(id: number) {
    if (id) {
      this.httpService
        .post<ContractNo[]>(`${Contract.apiAddressDel}/${id}`, {})

        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'contractNo',
              life: 8000,
              severity: 'success',
              detail: `کد قرارداد ${id}`,
              summary: 'با موفقیت حذف شد',
            });

            this.getContractlNo();
          }
        });
    }
  }

  editRow(data: ContractNo) {
    this.modalTitle = 'ویرایش بودجه پرسنل ';
    this.addEditData = data;
    this.addEditData.type = 'edit';
    this.isOpenAddEditContractlNo = true;
    // this.getContractDetails(data.id);
  }
}
