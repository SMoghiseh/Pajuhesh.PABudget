import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { BigGoal, Pagination, RelatedBigGoal, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-related-big-goal',
  templateUrl: './related-big-goal.component.html',
  styleUrls: ['./related-big-goal.component.scss'],
  providers: [ConfirmationService],

})
export class RelatedBigGoalComponent implements OnInit {
  addNewRelatedBigGoalForm!: FormGroup;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: RelatedBigGoal[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditForm = false;
  addEditData = new RelatedBigGoal();
  pId!: string;
  mode!: string;

  relatedBigGoalList: any = [];
  bigGoalList: any = [];

  get reportTypeCode() {
    return this.addNewRelatedBigGoalForm.get('reportTypeCode');
  }
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getRelatedBigGoalList();
    this.getBigGoalList();

    this.addNewRelatedBigGoalForm = new FormGroup({
      relatedBigGoalId: new FormControl(null),
      bigGoalId: new FormControl(null),
    });

    this.addNewRelatedBigGoalForm.patchValue({
      bigGoalId: Number(this.route.snapshot.paramMap.get('bigGoalId'))
    })

  }



  getRelatedBigGoalList() {
    this.httpService
      .get<any[]>(RelatedBigGoal.apiAddressList +
        Number(this.route.snapshot.paramMap.get('bigGoalId'))
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.relatedBigGoalList = response.data.result;
        }
      });
  }

  getBigGoalList() {
    this.httpService
      .post<any[]>(BigGoal.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }

  getList(event?: any) {
    if (event) this.lazyLoadEvent = event;
    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.addNewRelatedBigGoalForm.value;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;
    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      bigGoalId: formValue.bigGoalId
    };
    this.first = 0;
    const url = RelatedBigGoal.apiAddress + 'list';
    this.httpService
      .post<RelatedBigGoal[]>(url, body)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new RelatedBigGoal()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  clearSearch() {
    this.addNewRelatedBigGoalForm.reset();
    this.getList();
  }
  addReport() {
    this.modalTitle = 'افزودن';
    this.mode = 'insert';
    this.isOpenAddEditForm = true;
  }

  editRow(data: RelatedBigGoal) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditForm = true;
  }

  deleteRow(item: RelatedBigGoal) {
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
        accept: () => this.deleteReport(item.id, item.title),
      });
  }

  deleteReport(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<RelatedBigGoal>(
          UrlBuilder.build(
            RelatedBigGoal.apiAddress + 'Delete',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'relatedBigGoal',
              life: 8000,
              severity: 'success',
              detail: ` مورد  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getList();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditForm = false;
    this.getList();
  }


}
