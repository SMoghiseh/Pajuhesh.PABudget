import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  FinancialRatio
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'PABudget-financial-ratio',
  templateUrl: './financial-ratio.component.html',
  styleUrls: ['./financial-ratio.component.scss'],
  providers: [ConfirmationService]
})
export class FinancialRatioComponent {
  public datePipe = new DatePipe('en-US');

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: FinancialRatio[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditFinancialRatio = false;
  addEditData = new FinancialRatio();
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  companyList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getTypeCodeList();

    this.searchForm = new FormGroup({
      code: new FormControl(''),
      title: new FormControl(''),
      typeCode: new FormControl(0),
      description: new FormControl('')
    });
  }

  getTypeCodeList() {
    this.httpService
      .get<FinancialRatio[]>(FinancialRatio.apiAddressTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getFinancialRatio(event?: LazyLoadEvent) {
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
      ...formValue,
    };

    this.first = 0;
    const url = FinancialRatio.apiAddress + 'List';
    this.httpService
      .post<FinancialRatio[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new FinancialRatio()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addFinancialRatio() {
    this.modalTitle = 'افزودن  نسبت مالی جدید ';
    this.mode = 'insert';
    this.isOpenAddEditFinancialRatio = true;
  }

  editRow(data: FinancialRatio) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditFinancialRatio = true;
  }

  deleteRow(item: FinancialRatio) {
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
        accept: () => this.deleteFinancialRatio(item.id, item.title),
      });
  }

  deleteFinancialRatio(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<FinancialRatio>(
          UrlBuilder.build(FinancialRatio.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'FinancialRatio',
              life: 8000,
              severity: 'success',
              detail: ` برنامه  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getFinancialRatio();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditFinancialRatio = false;
    this.getFinancialRatio();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getFinancialRatio();
  }

}
