import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  YearGoal,
  Aspect,
  BigGoal,
  Company,
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
  selector: 'PABudget-year-goal',
  templateUrl: './year-goal.component.html',
  styleUrls: ['./year-goal.component.scss'],
  providers: [ConfirmationService],
})
export class YearGoalComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: YearGoal[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditYearGoal = false;
  addEditData = new YearGoal();
  pId!: string;
  mode!: string;
  selectedPeriodId = 0;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  aspectCodeList: any = [];
  companyList: any = [];
  bigGoalList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAspectCodeLst();
    this.getCompanyLst();

    this.searchForm = new FormGroup({
      title: new FormControl(null),
      yearGoalCode: new FormControl(null),
      companyId: new FormControl(null),
      bigGoalId: new FormControl(null),
      aspectCode: new FormControl(null),
    });

    this.selectedPeriodId = Number(this.route.snapshot.paramMap.get('id'));

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

  getBigGoalList(id: number) {
    this.httpService
      .post<BigGoal[]>(BigGoal.apiAddress + 'List', {
        withOutPagination: true,
        companyId: id
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }

  getAspectCodeLst() {
    this.httpService
      .get<Aspect[]>(Aspect.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.aspectCodeList = response.data.result;
        }
      });
  }

  onChangeCompany(e: any) {
    this.getBigGoalList(e.value)
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
      periodId: this.selectedPeriodId,
      ...formValue,
    };

    this.first = 0;
    const url = YearGoal.apiAddress + 'List';
    this.httpService
      .post<YearGoal[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new YearGoal()];
        })
      )
      .subscribe(res => {
        this.data = res;
      });
  }

  addYearGoal() {
    this.modalTitle = 'افزودن  ';
    this.mode = 'insert';
    this.isOpenAddEditYearGoal = true;
  }

  editRow(data: YearGoal) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearGoal = true;
  }

  navigateToIndicatorPage(item: any) {
    this.router.navigate(['Period/RelatedIndicator'],
      { queryParams: { page: 'YearGoal', id: item.id, companyId: item.companyId, periodId: this.selectedPeriodId } })
  }

  deleteRow(item: YearGoal) {
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
        accept: () => this.deleteYearGoal(item.id, item.title),
      });
  }

  deleteYearGoal(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<YearGoal>(
          UrlBuilder.build(YearGoal.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'yearGoal',
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
    this.isOpenAddEditYearGoal = false;
    this.getList();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getList();
  }
}
