import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  YearActivity,
  ManagerType,
  Period,
  Operating,
  ReferenceType,
  ReferenceList,
  Company,
  BudgetPeriod,
  Project,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  companyList: any[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenYearActivityrelatedToRisk = false;
  isOpenAddEditYearActivity = false;
  addEditData = new YearActivity();
  pId!: string;
  mode!: string;
  formSubmitted = false;
  isLoadingSubmit = false;

  // property modal for add breaking
  addYearActivityBreakingModal = false;
  breakingItem: any = [];
  selectedBreakingItem: any;
  rowSelected: any;

  // form property
  searchForm!: FormGroup;
  params!: number;
  getYearActivityId!: any;
  // dropdown data list
  budgetPeriodList: any = [];
  activityrelatedToRisk: any = [];
  periodDetailList: any = [];
  referenceList: any = [];
  referenceOnList: any = [];
  rollList: any = [];
  operationList: any = [];
  weightCodeList: any = [];
  priorityCodeList: any = [];
  costCenterList: any = [];
  subComponentList = [
    {
      label: ' پیش نیاز  ',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Operation/RelatedActivity'],
    },
    {
      label: ' لیست ریسک های مرتبط با برنامه  ',
      icon: 'pi pi-fw pi-star',

      command: () => {
        this.openDialog();
      },
    },
  ];

  get companyId() {
    return this.searchForm.get('companyId');
  }
  get periodId() {
    return this.searchForm.get('periodId');
  }
  get referenceCode() {
    return this.searchForm.get('referenceCode');
  }
  get referenceId() {
    return this.searchForm.get('referenceId');
  }

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getReferenceList();
    this.getManagerTypeList();
    this.getWeightCodeList();
    this.getPriorityCodeList();
    this.getCostCenterList();
    this.getCompanyLst();

    this.searchForm = new FormGroup({
      periodId: new FormControl(null),
      companyId: new FormControl(null),
      referenceCode: new FormControl(null),
      referenceId: new FormControl(null),
      fromPeriodDetailId: new FormControl(null),
      toPeriodDetailId: new FormControl(null),
      rollId: new FormControl(null),
      projectId: new FormControl(null),
      weightCode: new FormControl(null),
      priorityCode: new FormControl(null),
      code: new FormControl(null),
      title: new FormControl(null),
      description: new FormControl(null),
      priceCu: new FormControl(null),
      costCenterId: new FormControl(null),
    });

    this.searchForm.patchValue({
      // periodId: Number(
      //   this.route.snapshot.paramMap.get('periodId')
      // ),
      // yearGoalId: Number(this.route.snapshot.paramMap.get('yearGoalId')),
    });

    // this.getPeriodDetailList(
    //   Number(this.route.snapshot.paramMap.get('periodId'))
    // );
  }

  openDialog() {
    this.isOpenYearActivityrelatedToRisk = true;
    this.getYearActivityrelatedToRisk();
  }

  getBudgetPeriodList(companyId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown/' + companyId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
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

  getPeriodDetailList(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailList = response.data.result;
        }
      });
  }

  getReferenceList() {
    this.httpService
      .get<ReferenceType[]>(ReferenceType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.referenceList = response.data.result;
        }
      });
  }

  getReferenceFilteredList() {
    // check if periodId &  referenceCode is selected
    const formValue = this.searchForm.value;
    if (formValue.periodId & formValue.referenceCode) {
      this.getListByReference();
    }
  }

  onChangeCompanyId(e: any) {
    this.getBudgetPeriodList(e.value);
    this.getOperationList(e.value);
  }

  getListByReference() {
    const formValue = this.searchForm.value;

    const body = {
      referenceCode: formValue.referenceCode,
      periodId: formValue.periodId,
      companyId: formValue.companyId,
    };

    this.httpService
      .post<ReferenceList[]>(ReferenceList.apiAddress, body)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.referenceOnList = response.data.result;
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

  getOperationList(companyId: number) {
    this.httpService
      .get<Project[]>(Project.apiAddressCompany + companyId)
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

  getList(isInFilterMode: boolean, event?: LazyLoadEvent) {
    if (isInFilterMode) {
      this.formSubmitted = true;
      // check form validation
      if (this.searchForm.valid) {
        this.getFilteredTableList(event);
      }
    } else {
      this.getFilteredTableList(event);
    }
  }

  getFilteredTableList(event?: LazyLoadEvent) {
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

    // delete body['companyId'];
    // delete body['periodId'];
    // delete body['referenceCode'];

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
        res.forEach((element: any) => {
          this.getYearActivityId = element.id;
        });
      });
  }

  getYearActivityrelatedToRisk(event?: LazyLoadEvent) {
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
      yearActivityId: this.getYearActivityId,
    };

    this.first = 0;
    const url = YearActivity.apiYearActivityrelatedToRisk;
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
        this.activityrelatedToRisk = res;
      });
  }
  addSubComponentList(data: any) {
    data.forEach((row: any) => {
      row['componentList'] = [];
      let array = this.subComponentList;

      array = array.map(com => {
        if (com['routerLink']) {
          const params = '/' + row.id;
          const route = com['routerLink'][0].concat(params);
          return { ...com, routerLink: [route] };
        } else {
          return { ...com };
        }
      });

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
            this.getList(false);
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditYearActivity = false;
    this.getList(false);
  }

  clearSearch() {
    this.formSubmitted = false;
    this.searchForm.reset();
    this.getList(false);
  }

  // method modal for add breaking
  onOpenBreakingDialog(item: any) {
    this.addYearActivityBreakingModal = true;
    this.rowSelected = item;
    this.getBreakingData(item.id);
  }

  routeToInsertBreak(item: any) {
    this.rowSelected = item;
    this.router.navigate([
      '/Operation/OperationalPlanBreaking/' + this.rowSelected.id,
    ]);
  }

  getBreakingData(id: number) {
    this.httpService
      .get<BudgetPeriod[]>(BudgetPeriod.apiAddress + 'GetSeasonPercents/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.breakingItem = response.data.result;
        }
      });
  }

  onSelectYearActivityItem(item: any) {
    this.selectedBreakingItem = item;
  }

  addBreakingList() {
    const percentageList = this.breakingItem.map((item: { percent: any }) => {
      return item.percent ? Number(item.percent) : 0;
    });
    let sum = 0;
    percentageList.forEach((element: any) => {
      sum = sum + element;
    });
    if (sum != 100) {
      this.messageService.add({
        key: 'messageOnAddBreaking',
        life: 8000,
        severity: 'error',
        detail: ``,
        summary: 'جمع درصد های وارد شده برابر 100 نیست',
      });
      return;
    }

    const finalList = this.breakingItem.map(
      (item: { id: any; percent: any }) => {
        return { id: item.id, percent: Number(item.percent) };
      }
    );

    const data = {
      yearActivityId: this.rowSelected.id,
      seasonPercents: finalList,
    };

    this.httpService
      .post<BudgetPeriod>(
        BudgetPeriod.apiAddress + 'ProgramBreak/' + 'Create',
        data
      )
      .pipe(tap(() => (this.isLoadingSubmit = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'messageOnAddBreaking',
            life: 8000,
            severity: 'success',
            // detail: ` عنوان  ${request.title}`,
            detail: ``,
            summary: 'با موفقیت ثبت شد',
          });
          this.addYearActivityBreakingModal = false;
          this.router.navigate([
            '/Operation/OperationalPlanBreaking/' + this.rowSelected.id,
          ]);
        }
      });
  }
}
