import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  Pagination,
  Period,
  Project,
  ProjectIncome,
  UrlBuilder,
} from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-project-income',
  templateUrl: './project-income.component.html',
  styleUrls: ['./project-income.component.scss'],
  providers: [ConfirmationService],
})
export class ProjectIncomeComponent {
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
  data: ProjectIncome[] = [];
  first = 0;
  addEditData = new ProjectIncome();
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
      projectId: new FormControl(),
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

  addProjectIncome() {
    this.modalTitle = 'برآورد هزینه های پروژه  ';
    this.mode = 'insert';
    this.isOpenAddEditProjectIncome = true;
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

  getOperationPeriodLst(id: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown' + `/${id}`)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.OperationPeriodList = response.data.result;
        }
      });
  }

  // getPeriodDetailList() {
  //   this.httpService
  //     .get<Period[]>(Period.apiAddressDetail + 'ListDropDown')
  //     .subscribe(response => {
  //       if (response.data && response.data.result) {
  //         this.periodDetailList = response.data.result;
  //       }
  //     });
  // }

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

  editRow(data: ProjectIncome) {
    this.modalTitle = 'ویرایش ' + '"' + data.periodTitle + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditProjectIncome = true;
  }

  deleteRow(item: ProjectIncome) {
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
        accept: () => this.deleteProjectIncome(item.id, item.periodTitle),
      });
  }
  deleteProjectIncome(id: number, periodTitle: string) {
    if (id && periodTitle) {
      this.httpService
        .get<ProjectIncome>(
          UrlBuilder.build(ProjectIncome.apiAddress + 'Delete', '') + `/${id}`
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
            this.getProjectIncome();
          }
        });
    }
  }

  getProjectIncome(event?: LazyLoadEvent) {
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
    const url = ProjectIncome.apiAddress + 'List';
    this.httpService
      .post<ProjectIncome[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new ProjectIncome()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  clearSearch() {
    this.searchForm.reset();
    this.getProjectIncome();
  }

  reloadData() {
    this.isOpenAddEditProjectIncome = false;
    this.getProjectIncome();
  }
}
