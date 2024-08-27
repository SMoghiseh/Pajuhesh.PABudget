import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder, YearActivity, RelationType
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
  selector: 'PABudget-related-activity',
  templateUrl: './related-activity.component.html',
  styleUrls: ['./related-activity.component.scss'],
  providers: [ConfirmationService]
})
export class RelatedActivityComponent {
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
  yearActivityList: any = [];
  relatedYearActivityList: any = [];
  relationTypeList: any = [];


  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getYearActivityList();


    this.searchForm = new FormGroup({
      budgetPeriodId: new FormControl(''),
      relatedYearActivityId: new FormControl(''),
      relationType: new FormControl(''),
    });

    this.getRelatedYearActivityList(Number(this.route.snapshot.paramMap.get('yearActivityId')));

  }


  getYearActivityList() {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.yearActivityList = response.data.result;
        }
      });
  }

  getRelatedYearActivityList(yearActivityId: number) {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressExceptedYearActivities + 'List', + yearActivityId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.relatedYearActivityList = response.data.result;
        }
      });
  }

  getRelationTypeList() {
    this.httpService
      .get<RelationType[]>(RelationType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.relationTypeList = response.data.result;
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
    const url =
      YearActivity.apiAddress + 'List';
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
      .subscribe(res => (this.data = res));
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
          UrlBuilder.build(
            YearActivity.apiAddress + 'Delete',
            ''
          ) + `/${id}`
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
