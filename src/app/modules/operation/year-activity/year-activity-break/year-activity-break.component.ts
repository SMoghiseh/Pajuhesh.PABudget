import { Component } from '@angular/core';
import {
  UrlBuilder, RelatedActivity, BudgetPeriod
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'PABudget-year-activity-break',
  templateUrl: './year-activity-break.component.html',
  styleUrls: ['./year-activity-break.component.scss'],
  providers: [ConfirmationService],
})
export class YearActivityBreakComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount: number = 4;
  data: BudgetPeriod[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditYearActivity = false;
  addEditData = new BudgetPeriod();
  pId!: string;
  mode!: string;
  yearActivityId = 0;
  // form property
  searchForm!: FormGroup;

  // dropdown data list
  yearActivityList: any = [];
  relatedYearActivityList: any = [];
  relationTypeList: any = [];


  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.yearActivityId = Number(this.route.snapshot.paramMap.get('yearActivityId'))

  }



  getList(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    this.loading = true;

    this.first = 0;
    const url =
      BudgetPeriod.apiAddress + 'ProgramBreak/' + 'GetAll/' + this.yearActivityId;
    this.httpService
      .get<BudgetPeriod[]>(url)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new BudgetPeriod()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addYearActivity() {
    this.modalTitle = 'افزودن برنامه عملیاتی ';
    this.mode = 'insert';
    this.isOpenAddEditYearActivity = true;
  }

  editRow(data: BudgetPeriod) {
    this.modalTitle = 'ویرایش ' + '"' + data.yearActivityTitle + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearActivity = true;
  }

  deleteAll() {
      this.confirmationService.confirm({
        message: `آیا از حذف همه سطر ها اطمینان دارید؟`,
        header: `حذف شکست های برنامه عملیاتی `,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteAllRows(),
      });
  }

  deleteAllRows() {
    let url = BudgetPeriod.apiAddress + 'ProgramBreak/' + 'DeleteAll/' + this.yearActivityId;
      this.httpService
        .get<RelatedActivity>(url)
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'RelatedActivity',
              life: 8000,
              severity: 'success',
              detail: `  `,
              summary: 'با موفقیت حذف شد',
            });
           setTimeout(() => {
            this.router.navigate(['/Operation/OperationalPlan']);
           }, 1000);
          }
        });
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

