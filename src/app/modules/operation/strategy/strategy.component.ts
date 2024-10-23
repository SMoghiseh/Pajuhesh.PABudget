import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  STRATEGY,
  BigGoal,
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
  selector: 'PABudget-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss'],
  providers: [ConfirmationService],
})
export class StrategyComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: STRATEGY[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new STRATEGY();
  pId!: string;
  mode!: string;
  planningId = 0;
  companyId!: number;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  bigGoalList: any = [];
  getCompanyByPlanIdList: any = [];
  getPlanId!: number;

  subComponentList = [
    {
      label: ' SWOT  استراتژی',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Operation/StrategySWOT'],
    },
  ];
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBigGoalList();
    this.searchForm = new FormGroup({
      title: new FormControl(null),
      bigGoalId: new FormControl(null),
      strategyCode: new FormControl(null),
      strategyPriority: new FormControl(null),
    });
    this.planningId = Number(this.route.snapshot.paramMap.get('id'));
    this.getCompanyByPlanId(this.planningId);
  }

  getBigGoalList() {
    this.httpService
      .post<BigGoal[]>(BigGoal.apiAddress + 'List', { withOutPagination: true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }
  addSubComponentList(data: any) {
    debugger;
    data.forEach((row: any) => {
      row['componentList'] = [];
      let array = this.subComponentList;
      const snapshotParams =
        '/' + Number(this.route.snapshot.paramMap.get('id'));

      array = array.map(com => {
        const params = snapshotParams + '/' + row.id;
        const route = com['routerLink'][0].concat(params);
        return { ...com, routerLink: [route] };
      });

      row['componentList'].push(...array);
    });
    return data;
  }
  getData(event?: LazyLoadEvent) {
    debugger;
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
      planningValue: this.planningId,
      withOutPagination: false,
      ...formValue,
    };

    this.first = 0;
    const url = STRATEGY.apiAddress + 'List';
    this.httpService
      .post<STRATEGY[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new STRATEGY()];
        })
      )
      .subscribe(res => {
        this.companyId = res[0].companyId;
        this.data = res;
        this.addSubComponentList(res);
      });
  }

  addPlan() {
    this.modalTitle = 'افزودن استراتژی  ';
    this.mode = 'insert';
    this.addEditData.companyId = this.companyId;
    this.isOpenAddEditPlan = true;
  }

  editRow(data: STRATEGY) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: STRATEGY) {
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
        accept: () => this.deletePlan(item.id, item.title),
      });
  }

  getCompanyByPlanId(id: number) {
    this.httpService
      .get<BigGoal[]>(BigGoal.apiAddressGetComPlanId + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.getCompanyByPlanIdList = response.data.result;
          this.getPlanId = this.getCompanyByPlanIdList;
        }
      });
  }
  deletePlan(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<STRATEGY>(
          UrlBuilder.build(STRATEGY.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'strategy',
              life: 8000,
              severity: 'success',
              detail: ` مورد   ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getData();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditPlan = false;
    this.getData();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getData();
  }
}
