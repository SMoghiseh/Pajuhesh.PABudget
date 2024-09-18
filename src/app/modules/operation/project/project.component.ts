import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  Pagination,
  Period,
  Project,
  UrlBuilder,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [ConfirmationService],
})
export class ProjectComponent {
  searchForm!: FormGroup;
  modalTitle = '';
  mode!: string;
  companyList: any = [];
  budgetPeriodList: any = [];
  fromToBudgetPeriodList: any = [];
  projectTypeCodeList: any = [];
  isOpenAddEditProject = false;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  data: Project[] = [];
  first = 0;
  addEditData = new Project();
  subComponentList = [
    {
      label: 'برآورد هزینه های پروژه',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Operation/ProjectIncome'],
    },
    {
      label: 'هزینه های پروژه',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Operation/ProjectCost'],
    },
  ];
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) {}
  ngOnInit(): void {
    this.getBudgetPeriodLst();
    this.getCompanyLst();
    this.getprojectTypeCodeLst();

    this.searchForm = new FormGroup({
      budgetPeriodId: new FormControl(null),
      fromBudgetPeriodId: new FormControl(null),
      toBudgetPeriodId: new FormControl(null),
      code: new FormControl(null),
      title: new FormControl(null),
      companyId: new FormControl(null),
      address: new FormControl(null),
      typeCode: new FormControl(null),
      internalRateOfReturn: new FormControl(null),
      netPersentValue: new FormControl(null),
      payBackPeriod: new FormControl(null),
    });
  }
  addProject() {
    this.modalTitle = 'افزودن پروژه';
    this.mode = 'insert';
    this.isOpenAddEditProject = true;
  }
  reloadData() {
    this.isOpenAddEditProject = false;
    this.getProject();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getProject();
  }

  getProject(event?: LazyLoadEvent) {
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
    const url = Project.apiAddress + 'List';
    this.httpService
      .post<Project[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Project()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  deleteRow(item: Project) {
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
        accept: () => this.deleteProject(item.id, item.title),
      });
  }
  deleteProject(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<Project>(
          UrlBuilder.build(Project.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.first = 0;
            this.messageService.add({
              key: 'plan',
              life: 8000,
              severity: 'success',
              detail: ` پروژه  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getProject();
          }
        });
    }
  }

  onChangBudgetPeriod(e: any) {
    this.getfromToBudgetPeriodLst(e.value);
  }
  editRow(data: Project) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditProject = true;
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

  getBudgetPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
  }

  getfromToBudgetPeriodLst(id: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown' + `/${id}`)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.fromToBudgetPeriodList = response.data.result;
        }
      });
  }
  getprojectTypeCodeLst() {
    this.httpService
      .get<Project[]>(Project.apiAddressProjectTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.projectTypeCodeList = response.data.result;
        }
      });
  }

  // Set PlanningId On Active Component Route
  setActiveComponentRoute(item: Project) {
    this.subComponentList.forEach((componentInfo: any) => {
      componentInfo['routerLink'][0] =
        componentInfo['routerLink'][0] + '/' + item.id;
    });
  }
}
