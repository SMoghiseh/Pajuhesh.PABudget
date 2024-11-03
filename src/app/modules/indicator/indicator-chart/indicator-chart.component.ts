import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Indicator,
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
  selector: 'PABudget-indicator-chart',
  templateUrl: './indicator-chart.component.html',
  styleUrls: ['./indicator-chart.component.scss'],
  providers: [ConfirmationService],
})
export class IndicatorChartComponent {
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
  groupTypeCodeList: any = [];
  subComponentList = [
    {
      label: ' مقادیر جدول مرتبط',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Indicator/IndicatorChartValue'],
    },
  ];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getGroupTypeCodeList();

    this.searchForm = new FormGroup({
      title: new FormControl(null),
      groupTypeCode: new FormControl(null),
    });
  }

  getGroupTypeCodeList() {
    // this.httpService
    //   .get<Indicator[]>(Indicator + 'list')
    //   .subscribe(response => {
    //     if (response.data && response.data.result) {
    //       this.groupTypeCodeList = response.data.result;
    //     }
    //   });
  }

  addSubComponentList(data: any) {
    data.forEach((row: any) => {
      row['componentList'] = [];
      let array = this.subComponentList;

      array = array.map(com => {
        const params = '/' + row.id;
        const route = com['routerLink'][0].concat(params);
        return { ...com, routerLink: [route] };
      });

      row['componentList'].push(...array);
    });
    return data;
  }

  getIndicatorChart(event?: LazyLoadEvent) {
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
    const url = Indicator.apiAddressIndicator + 'GetAllIndicatorCharts';
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
        this.data = this.addSubComponentList(res);
      });
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
            Indicator.apiAddressIndicator + 'DeleteIndicatorChart',
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
            this.getIndicatorChart();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditIndicator = false;
    this.getIndicatorChart();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getIndicatorChart();
  }
}
