import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  RelatedYearRisk, YearActivity
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
  selector: 'PABudget-related-year-risk',
  templateUrl: './related-year-risk.component.html',
  styleUrls: ['./related-year-risk.component.scss'],
  providers: [ConfirmationService]
})
export class RelatedYearRiskComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: RelatedYearRisk[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditYearGoal = false;
  addEditData = new RelatedYearRisk();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  yearList: any = [];
  yearActivityList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getYearActivityList();
    this.searchForm = new FormGroup({
      yearActivityId: new FormControl(null),
      yearRiskId: new FormControl(null),
      isOptimistically: new FormControl(1)
    });
  }

  getYearActivityList() {
    this.httpService
      .post<YearActivity[]>(YearActivity.apiAddress + 'List',
        {
          withOutPagination: true
        })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.yearActivityList = response.data.result;
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

    body.isOptimistically = body.isOptimistically ? true : false;
    body.yearRiskId = Number(this.route.snapshot.paramMap.get('yearRisk'));


    this.first = 0;
    const url = RelatedYearRisk.apiAddress + 'GetAllRelatedYearRiskPrograms/' + 'List';
    this.httpService
      .post<RelatedYearRisk[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new RelatedYearRisk()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addRelatedYearRisk() {
    this.modalTitle = 'افزودن  ';
    this.mode = 'insert';
    this.isOpenAddEditYearGoal = true;
  }

  editRow(data: RelatedYearRisk) {
    this.modalTitle = 'ویرایش ' + '"' + data.yearActivityTitle + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearGoal = true;
  }

  deleteRow(item: RelatedYearRisk) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.yearActivityTitle} " اطمینان دارید؟`,
        header: `عنوان "${item.yearActivityTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteYearGoal(item.id, item.yearActivityTitle),
      });
  }

  deleteYearGoal(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<RelatedYearRisk>(
          UrlBuilder.build(RelatedYearRisk.apiAddress + 'RelatedYearRiskProgram/' + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'RelatedYearRisk',
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
