import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  AssemblyAssignments,
  Pagination,
  UrlBuilder,
} from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-assembly-assignments-details',
  templateUrl: './assembly-assignments-details.component.html',
  styleUrls: ['./assembly-assignments-details.component.scss'],
})
export class AssemblyAssignmentsDetailsComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: AssemblyAssignments[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new AssemblyAssignments();
  pId!: string;
  mode!: string;
  isOpenAddEditAssemblyAssignmentsDetails = false;
  MeetingTopicList: any = [];
  // form property
  searchForm!: FormGroup;

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    debugger;
    this.searchForm = new FormGroup({
      yearUnionId: new FormControl(null),
      typeCode: new FormControl(null),
      title: new FormControl(null),
    });
  }

  addAssemblyAssignmentsDetails() {
    this.modalTitle = 'افزودن مفاد ';
    this.mode = 'insert';
    this.isOpenAddEditAssemblyAssignmentsDetails = true;
  }

  editRow(data: AssemblyAssignments) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }
  deleteRow(item: AssemblyAssignments) {
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
        accept: () =>
          this.deleteAssemblyAssignmentsDetails(item.id, item.title),
      });
  }

  getMeetingTopicList() {
    this.httpService
      .get<AssemblyAssignments[]>(
        AssemblyAssignments.apiAddressMeetingTopic + 'List',
        {
          withOutPagination: true,
        }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.MeetingTopicList = response.data.result;
        }
      });
  }
  deleteAssemblyAssignmentsDetails(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<AssemblyAssignments>(
          UrlBuilder.build(AssemblyAssignments.apiAddress + 'Delete', '') +
            `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'vision',
              life: 8000,
              severity: 'success',
              detail: ` چشم انداز  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getAssemblyAssignmentsDetails();
          }
        });
    }
  }
  getAssemblyAssignmentsDetails(event?: LazyLoadEvent) {
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
    const url = AssemblyAssignments.apiAddress + 'List';
    this.httpService
      .post<AssemblyAssignments[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new AssemblyAssignments()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  reloadData() {
    this.isOpenAddEditPlan = false;
    this.getAssemblyAssignmentsDetails();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getAssemblyAssignmentsDetails();
  }
}
