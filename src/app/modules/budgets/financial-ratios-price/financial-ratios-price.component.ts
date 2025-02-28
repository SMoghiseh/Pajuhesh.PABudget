import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  FinancialRatiosPrice,
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
  selector: 'PABudget-financial-ratios-price',
  templateUrl: './financial-ratios-price.component.html',
  styleUrls: ['./financial-ratios-price.component.scss'],
  providers: [ConfirmationService],
})
export class FinancialRatiosPriceComponent {
  searchForm!: FormGroup;
  mode!: string;
  modalTitle = '';
  addEditData = new FinancialRatiosPrice();
  companyList: any = [];
  financialRatioList: any = [];
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  lazyLoadEvent?: LazyLoadEvent;
  totalCount!: number;
  loading = false;
  first = 0;
  data: FinancialRatiosPrice[] = [];
  selectedPeriodId = 0;

  isOpenAddEditFinancialRatiosPrice = false;
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.getFinancialRatioLst();
    this.getCompanyLst();
    this.searchForm = new FormGroup({
      financialRatioId: new FormControl(),
      companyId: new FormControl(null),
      // periodId: new FormControl(null),
      // price: new FormControl(null),
      // code: new FormControl('02'),
    });

    this.selectedPeriodId = Number(this.route.snapshot.paramMap.get('id'));
    this.searchForm.patchValue({
      periodId: this.selectedPeriodId
    });

  }

  getFinancialRatiosPriceList(event?: LazyLoadEvent) {
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
      withOutPagination: true,
      financialRatioId: formValue.financialRatioId,
      periodId: this.selectedPeriodId,
      companyId: formValue.companyId,
    };

    this.first = 0;
    const url = FinancialRatiosPrice.apiAddress + 'List';
    this.httpService
      .post<FinancialRatiosPrice[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new FinancialRatiosPrice()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addFinancialRatiosPrice(data: string) {
    this.modalTitle = 'افزودن نسبت های مالی';
    this.addEditData.type = 'insert';
    this.mode = 'insert';
    this.isOpenAddEditFinancialRatiosPrice = true;
  }
  editRow(data: FinancialRatiosPrice) {
    this.modalTitle = 'ویرایش ' + '"' + data.companyName + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditFinancialRatiosPrice = true;
  }
  deleteRow(item: FinancialRatiosPrice) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.companyName} " اطمینان دارید؟`,
        header: `عنوان "${item.companyName}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteFinancialRatiosPrice(item.id, item.companyName),
      });
  }
  deleteFinancialRatiosPrice(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<FinancialRatiosPrice>(
          UrlBuilder.build(FinancialRatiosPrice.apiAddress + 'Delete', '') +
          `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'FinancialRatiosPrice',
              life: 8000,
              severity: 'success',
              detail: `  مورد  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getFinancialRatiosPriceList();
          }
        });
    }
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

  getFinancialRatioLst() {
    this.httpService
      .post<FinancialRatiosPrice[]>(
        FinancialRatiosPrice.apiAddressFinancialRatio,
        {
          withOutPagination: true,
        }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.financialRatioList = response.data.result;
        }
      });
  }
  reloadData() {
    this.isOpenAddEditFinancialRatiosPrice = false;
    this.getFinancialRatiosPriceList();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getFinancialRatiosPriceList();
  }
}
