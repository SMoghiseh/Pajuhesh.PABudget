import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { Indicator, Pagination, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
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
  modalTitle = '';
  isOpenAddEditIndicator = false;
  addEditData = new Indicator();
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  periodTypeList: any = [];
  minMaxTypeCodeList: any = [];
  qualityTypeCodeList: any = [];
  indicatorTypeList: any = [];


  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getIndicatorTypeList();
    this.getMinMaxTypeCodeList();
    this.getQualityTypeCodeList();
    this.getPeriodTypeList();

    this.searchForm = new FormGroup({
      code: new FormControl(''),
      title: new FormControl(''),
      accountReportItemId: new FormControl(null),
      indicatorTypeCode: new FormControl(null),
      periodTypeCode: new FormControl(null),
      minMaxTypeCode: new FormControl(null),
      // chartTypeCode: new FormControl(null),
      qualityTypeCode: new FormControl(null),
    });
  }
  getPeriodTypeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiaddressPeriodTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodTypeList = response.data.result;
        }
      });
  }
  getMinMaxTypeCodeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiAddressMinMaxTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.minMaxTypeCodeList = response.data.result;
        }
      });
  }
  getQualityTypeCodeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiAddressQualityTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.qualityTypeCodeList = response.data.result;
        }
      });
  }
  getIndicatorTypeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiaddressIndicatorType + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.indicatorTypeList = response.data.result;
        }
      });
  }



  getIndicator(event?: LazyLoadEvent) { debugger
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
    const url = Indicator.apiAddressIndicator + 'GetAllIndicators';
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
      // .subscribe(res => {
      //   this.data = this.addSubComponentList(res);
      // });
  }

  addIndicator() {
    this.modalTitle = 'افزودن  شاخص  جدید ';
    this.mode = 'insert';
    this.isOpenAddEditIndicator = true;
  }

  closeModal() {
    this.isOpenAddEditIndicator = false;
  }
  editRow(data: Indicator) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditIndicator = true;
  }

  deleteRow(item: Indicator) {
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
        accept: () => this.deleteIndicator(item.id, item.title),
      });
  }

  deleteIndicator(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<Indicator>(
          UrlBuilder.build(
            Indicator.apiAddressIndicator + 'DeleteIndicator',
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
              detail: ` شاخص  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getIndicator();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditIndicator = false;
    this.getIndicator();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getIndicator();
  }
  

}
