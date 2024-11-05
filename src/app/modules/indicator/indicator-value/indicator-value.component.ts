import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  Indicator,
  Pagination,
  Period,
  UrlBuilder,
} from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-indicator-value',
  templateUrl: './indicator-value.component.html',
  styleUrls: ['./indicator-value.component.scss'],
  providers: [ConfirmationService],
})
export class IndicatorValueComponent {
  public datePipe = new DatePipe('en-US');

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Indicator[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  periodDetailLst: Period[] = [];
  getindicatorId: any;
  modalTitle = '';
  isOpenAddEditIndicator = false;
  addEditData = new Indicator();
  mode!: string;
  public submitted = false;
  // form property
  searchForm!: FormGroup;

  // dropdown data list
  inputData = new Indicator();
  chartValueList: any = [];
  companyList: any = [];
  periodList: any = [];
  insertIndicatorValueList: any = [];
  // addInputs: any

  get companyId() {
    return this.searchForm.get('companyId');
  }
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCompanyLst();
    this.getPeriodList();
    // this.getPeriodDetailLst(e.value);
    this.route.params.subscribe(params => {
      this.getindicatorId = params['id'];
    });
    // this.getChartValueListList();

    this.searchForm = new FormGroup({
      qualityValue: new FormControl(null),
      minValue: new FormControl(null),
      maxValue: new FormControl(null),
      fromPeriodDetailId: new FormControl(null),
      toPeriodDetailId: new FormControl(null),
      periodId: new FormControl(null),
      // chartTypeCode: new FormControl(null),
      indicatorId: new FormControl(null),
      companyId: new FormControl(null),
    });
  }

  onChangePeriod(e: any) {
    this.getChartValueList(e.value);
    this.getPeriodDetailLst(e.value);
  }

  getInsertIndicatorValue(id?: any) {
    this.httpService
      .get<Indicator[]>(
        Indicator.apiAddressIndicator + 'GetIndicatorValueInputs' + `/${id}`
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.insertIndicatorValueList = response.data.result;
        }
      });
  }
  getChartValueList(periodId: number) {
    const body = {
      indicatorId: parseInt(this.getindicatorId),
      periodId: periodId,
    };

    this.httpService
      .post<Indicator[]>(Indicator.apiAddressChartvalue, body)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.chartValueList = response.data.result;
          if (this.inputData.id)
            this.searchForm.patchValue({
              qualityValue: this.inputData.qualityValue,
            });
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
            this.searchForm.patchValue({
              toPeriodDetailId: this.inputData.toPeriodDetailId,
              fromPeriodDetailId: this.inputData.fromPeriodDetailId,
            });
        }
      });
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

  getPeriodList() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodList = response.data.result;
        }
      });
  }

  getIndicatorValue(event?: LazyLoadEvent) {
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
      indicatorId: this.getindicatorId,
    };

    this.first = 0;
    const url = Indicator.apiAddressIndicator + 'GetAllIndicatorValues';
    this.httpService
      .post<Indicator[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Indicator()];
        })
      )
      .subscribe(res => {
        this.data = res;
      });
  }

  addIndicator() {
    this.modalTitle = 'افزودن  مقدار شاخص  جدید ';
    this.mode = 'insert';
    this.isOpenAddEditIndicator = true;
    this.getInsertIndicatorValue(this.getindicatorId);
  }

  closeModal() {
    this.isOpenAddEditIndicator = false;
  }
  editRow(data: Indicator) {
    this.modalTitle = 'ویرایش مقدار شاخص  ' + '"' + data.indicatorTitle + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditIndicator = true;
  }

  deleteRow(item: Indicator) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.indicatorTitle} " اطمینان دارید؟`,
        header: `عنوان شاخص "${item.indicatorTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteIndicator(item.id, item.indicatorTitle),
      });
  }

  deleteIndicator(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<Indicator>(
          UrlBuilder.build(
            Indicator.apiAddressIndicator + 'DeleteIndicatorValue',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: ' Indicator',
              life: 8000,
              severity: 'success',
              detail: ` مقدار شاخص  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getIndicatorValue();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditIndicator = false;
    this.getIndicatorValue();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getIndicatorValue();
  }
}
