import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  YearActivity,
  ManagerType,
  YearGoal,
  Period,
  Operating,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-year-activity',
  templateUrl: './year-activity.component.html',
  styleUrls: ['./year-activity.component.scss'],
  providers: [ConfirmationService],
})
export class YearActivityComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: YearActivity[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditYearActivity = false;
  addEditData = new YearActivity();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  budgetPeriodList: any = [];
  periodDetailList: any = [];
  yearGoalList: any = [];
  rollList: any = [];
  operationList: any = [];
  weightCodeList: any = [];
  priorityCodeList: any = [];
  costCenterList: any = [];
  subComponentList = [
    {
      label: ' پیش نیاز  ',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/RelatedActivity'],
    }
  ];
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getBudgetPeriodList();
    this.getYearGoalList();
    this.getManagerTypeList();
    this.getOperationList();
    this.getWeightCodeList();
    this.getPriorityCodeList();
    this.getCostCenterList();

    this.searchForm = new FormGroup({
      budgetPeriodId: new FormControl(null),
      yearGoalId: new FormControl(null),
      fromPeriodDetailId: new FormControl(null),
      toPeriodDetailId: new FormControl(null),
      rollId: new FormControl(null),
      operatingId: new FormControl(null),
      weightCode: new FormControl(null),
      priorityCode: new FormControl(null),
      code: new FormControl(null),
      title: new FormControl(null),
      description: new FormControl(null),
      priceCu: new FormControl(null),
      costCenterId: new FormControl(null),
    });

    this.searchForm.patchValue({
      budgetPeriodId: Number(
        this.route.snapshot.paramMap.get('budgetPeriodId')
      ),
      yearGoalId: Number(this.route.snapshot.paramMap.get('yearGoalId')),
    });

    this.getPeriodDetailList(
      Number(this.route.snapshot.paramMap.get('budgetPeriodId'))
    );
  }

  getBudgetPeriodList() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
  }

  getPeriodDetailList(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailList = response.data.result;
        }
      });
  }

  getYearGoalList() {
    this.httpService
      .post<YearGoal[]>(YearGoal.apiAddress + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.yearGoalList = response.data.result;
        }
      });
  }

  getManagerTypeList() {
    this.httpService
      .get<ManagerType[]>(ManagerType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.rollList = response.data.result;
        }
      });
  }

  getOperationList() {
    this.httpService
      .post<Operating[]>(Operating.apiAddress + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.operationList = response.data.result;
        }
      });
  }

  getWeightCodeList() {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressWeight + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.weightCodeList = response.data.result;
        }
      });
  }

  getPriorityCodeList() {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressPriority + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.priorityCodeList = response.data.result;
        }
      });
  }
  getCostCenterList() {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressCostCenter + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.costCenterList = response.data.result;
        }
      });
  }

  getList(event?: LazyLoadEvent) {
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
    const url = YearActivity.apiAddress + 'List';
    this.httpService
      .post<YearActivity[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new YearActivity()];
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
      let snapshotParams = '/' + Number(this.route.snapshot.paramMap.get('budgetPeriodId')) + '/' +
        Number(this.route.snapshot.paramMap.get('yearGoalId'));

      array = array.map(com => {
        let params = snapshotParams + '/' + row.id;
        let route = com['routerLink'][0].concat(params);
        return { ...com, routerLink: [route] }
      })

      row['componentList'].push(...array);

    });
    return data;
  }


  addYearActivity() {
    this.modalTitle = 'افزودن برنامه عملیاتی   ';
    this.mode = 'insert';
    this.isOpenAddEditYearActivity = true;
  }

  editRow(data: YearActivity) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearActivity = true;
  }

  deleteRow(item: YearActivity) {
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
        accept: () => this.deleteYearActivity(item.id, item.title),
      });
  }

  deleteYearActivity(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<YearActivity>(
          UrlBuilder.build(YearActivity.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'YearActivity',
              life: 8000,
              severity: 'success',
              detail: `  مورد  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getList();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditYearActivity = false;
    this.getList();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getList();
  }

}
