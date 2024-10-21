import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  Pagination,
  Period,
  Project,
  ProjectCost,
  UrlBuilder,
} from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-project-cost',
  templateUrl: './project-cost.component.html',
  styleUrls: ['./project-cost.component.scss'],
  providers: [ConfirmationService],
})
export class ProjectCostComponent {
  searchForm!: FormGroup;
  modalTitle = '';
  mode!: string;
  isOpenAddEditProjectIncome = false;
  budgetPeriodList: any = [];
  periodDetailList: any = [];
  OperationPeriodList: any = [];
  unitList: any = [];
  sourceTypeList: any = [];
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  data: ProjectCost[] = [];
  first = 0;

  addEditData = new ProjectCost();
  get percentGrow() {
    return this.searchForm.get('percentGrow');
  }
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getBudgetPeriodLst();
    this.getunitList();
    this.getProjectSourceTypeList();
    this.searchForm = new FormGroup({
      periodId: new FormControl(null),
      periodDetailId: new FormControl(null),
      projectId: new FormControl(null),
      unitId: new FormControl(null),
      sourceType: new FormControl(null),
      percentGrow: new FormControl(null),
      estimatePriceCu: new FormControl(null),
      realPriceCu: new FormControl(null),
    });
    this.route.params.subscribe(params => {
      const RouteId = params['id'];
      this.searchForm.patchValue({ projectId: parseInt(RouteId) });
    });
  }

  onChangBudgetPeriod(e: any) {
    this.getOperationPeriodLst(e.value);
  }
  getBudgetPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
  }
  onlyNumberKey(event: { charCode: number }) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : event.charCode >= 48 && event.charCode <= 57;
  }

  getunitList() {
    this.httpService
      .post<Period[]>(Period.apiAddressUnits + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.unitList = response.data.result;
        }
      });
  }
  getProjectSourceTypeList() {
    this.httpService
      .get<Project[]>(Project.apiAddressSourceType + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.sourceTypeList = response.data.result;
        }
      });
  }
  getOperationPeriodLst(id: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown' + `/${id}`)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.OperationPeriodList = response.data.result;
        }
      });
  }
  addProjectCost() {
    this.modalTitle = 'برآورد هزینه های پروژه  ';
    this.mode = 'insert';
    this.isOpenAddEditProjectIncome = true;
  }

  editRow(data: ProjectCost) {
    this.modalTitle = 'ویرایش ' + '"' + data.periodTitle + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditProjectIncome = true;
  }
  deleteRow(item: ProjectCost) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.periodTitle} " اطمینان دارید؟`,
        header: `عنوان "${item.periodTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteProjectCost(item.id, item.periodTitle),
      });
  }
  deleteProjectCost(id: number, periodTitle: string) {
    if (id && periodTitle) {
      this.httpService
        .get<ProjectCost>(
          UrlBuilder.build(ProjectCost.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'plan',
              life: 8000,
              severity: 'success',
              detail: ` برنامه  ${periodTitle}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getProjectCost();
          }
        });
    }
  }
  getProjectCost(event?: LazyLoadEvent) {
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
    const url = ProjectCost.apiAddress + 'List';
    this.httpService
      .post<ProjectCost[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new ProjectCost()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  clearSearch() {
    this.searchForm.reset();
    this.getProjectCost();
  }

  reloadData() {
    this.isOpenAddEditProjectIncome = false;
    this.getProjectCost();
  }
}
