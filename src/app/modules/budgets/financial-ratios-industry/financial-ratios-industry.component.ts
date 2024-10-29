import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  FinancialRatiosIndustry,
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
  selector: 'PABudget-financial-ratios-industry',
  templateUrl: './financial-ratios-industry.component.html',
  styleUrls: ['./financial-ratios-industry.component.scss'],
  providers: [ConfirmationService],
})
export class FinancialRatiosIndustryComponent {
  searchForm!: FormGroup;
  financialRatioList: any = [];
  industryList: any = [];
  mode!: string;
  modalTitle = '';
  addEditData = new FinancialRatiosIndustry();
  companyList: any = [];
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  lazyLoadEvent?: LazyLoadEvent;
  totalCount!: number;
  loading = false;
  first = 0;
  data: FinancialRatiosIndustry[] = [];
  selectedPeriodId = 0;

  // subComponentList = [
  //   {
  //     label: 'مفاد ',
  //     icon: 'pi pi-fw pi-plus',
  //     routerLink: ['/Period/YearUnionDetail'],
  //   },
  // ];

  isOpenAddEditFinancialRatiosIndustry = false;
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getFinancialRatioLst();
    this.getIndustryLst();
    this.searchForm = new FormGroup({
      financialRatioId: new FormControl(),
      industryId: new FormControl(null),
      periodId: new FormControl(null),
      price: new FormControl(null),
      code: new FormControl(null),
    });

    this.selectedPeriodId = Number(this.route.snapshot.paramMap.get('id'));

  }

  getFinancialRatiosIndustryList(event?: LazyLoadEvent) {
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
      periodId : this.selectedPeriodId,
      financialRatioId: formValue.financialRatioId,
      industryId: formValue.industryId,
    };

    this.first = 0;
    const url = FinancialRatiosIndustry.apiAddress + 'List';
    this.httpService
      .post<FinancialRatiosIndustry[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new FinancialRatiosIndustry()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  getFinancialRatioLst() {
    this.httpService
      .post<FinancialRatiosIndustry[]>(
        FinancialRatiosIndustry.apiAddressFinancialRatio,
        { withOutPagination: true }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.financialRatioList = response.data.result;
        }
      });
  }

  getIndustryLst() {
    this.httpService
      .get<FinancialRatiosIndustry[]>(
        FinancialRatiosIndustry.apiAddressIndustryLst
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.industryList = response.data.result;
        }
      });
  }

  addFinancialRatiosIndustry(data: string) {
    this.modalTitle = 'افزودن نسبت های مالی صنعت';
    this.addEditData.type = 'insert';
    this.mode = 'insert';
    this.isOpenAddEditFinancialRatiosIndustry = true;
  }
  editRow(data: FinancialRatiosIndustry) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditFinancialRatiosIndustry = true;
  }
  deleteRow(item: FinancialRatiosIndustry) {
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
        accept: () => this.deleteFinancialRatiosIndustry(item.id, item.title),
      });
  }
  deleteFinancialRatiosIndustry(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<FinancialRatiosIndustry>(
          UrlBuilder.build(FinancialRatiosIndustry.apiAddress + 'Delete', '') +
            `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'FinancialRatiosIndustry',
              life: 8000,
              severity: 'success',
              detail: `  مورد  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getFinancialRatiosIndustryList();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditFinancialRatiosIndustry = false;
    this.getFinancialRatiosIndustryList();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getFinancialRatiosIndustryList();
  }
}
