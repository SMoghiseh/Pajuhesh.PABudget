import { Component, OnInit } from '@angular/core';
import { Pagination, Period, UrlBuilder } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-period-definition',
  templateUrl: './period-definition.component.html',
  styleUrls: ['./period-definition.component.scss'],
  providers: [ConfirmationService],
})
export class PeriodDefinitionComponent implements OnInit {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Period[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  pageTitle = '';
  isOpenAddEditPeriod = false;
  addEditData = new Period();
  isDetail = false;
  pId!: string;
  subComponentList = [
    {
      label: ' اهداف سالیانه',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/YearGoal'],
    },
    {
      label: ' تکالیف مجمع',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/YearUnion'],
    },
    {
      label: '  مفروضات',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/Assumptions'],
    },
    {
      label: '  سیاست ها',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/YearPolicy'],
    },
    {
      label: '  ریسک ها',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/YearRisk'],
    },
    {
      label: ' نسبت های مالی',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/FinancialRatiosPrice'],
    },
    {
      label: '  نسبت های مالی صنعت',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/FinancialRatiosIndustry'],
    },
  ];
  loginData: any;
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loginData = localStorage.getItem('loginData');
    this.loginData = loginData ? JSON.parse(loginData) : {};
    this.route.params.subscribe((param: any) => {
      if (param.id) {
        this.isDetail = true;
        this.pId = param.id;
        this.getPeriodSelectedData(param.id);
      } else this.pageTitle = 'لیست دوره ها';
    });
  }

  getPeriod(event?: LazyLoadEvent) {
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
    const url = this.pId
      ? Period.apiAddressDetail + 'List'
      : Period.apiAddress + 'ListByFilter';
    this.httpService
      .post<Period[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Period()];
        })
      )
      .subscribe(res => {
        this.data = this.addSubComponentList(res);
      });
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

  getPeriodSelectedData(id: number) {
    this.httpService.get<any>(Period.apiAddress + id).subscribe(response => {
      if (response.data && response.data.result) {
        this.pageTitle = response.data.result.periodTitle;
      }
    });
  }

  addPeriod() {
    this.modalTitle = 'افزودن دوره بودجه جدید';
    this.addEditData.type1 = 'insert';
    if (this.isDetail) {
      this.addEditData.periodId = parseInt(this.pId);
      this.addEditData.type2 = 'detail';
    } else this.addEditData.type2 = 'master';

    this.isOpenAddEditPeriod = true;
  }

  editRow(data: Period) {
    this.modalTitle = 'ویرایش دوره ' + data.title;
    this.addEditData = data;
    this.addEditData.type1 = 'edit';
    if (this.isDetail) {
      this.addEditData.periodId = parseInt(this.pId);
      this.addEditData.type2 = 'detail';
    } else this.addEditData.type2 = 'master';

    this.isOpenAddEditPeriod = true;
  }

  deleteRow(period: Period) {
    if (period && period.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف دوره بودجه اطمینان دارید؟',
        header: `عنوان ${period.title}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePeriod(period.id, period.title),
      });
  }

  deletePeriod(id: number, title: string) {
    if (id && title) {
      let url = '';
      if (this.isDetail) url = Period.apiAddressDetail;
      else url = Period.apiAddress;
      this.httpService
        .get<Period>(UrlBuilder.build(url + 'DELETE', '') + `/${id}`)
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'periodDefinition',
              life: 8000,
              severity: 'success',
              detail: `دوره ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getPeriod();
          }
        });
    }
  }

  periodDetail(data: Period) {
    this.router.navigate(['/baseinfo/period/' + data.id]);
  }

  reloadData() {
    this.isOpenAddEditPeriod = false;
    this.getPeriod();
  }
}
