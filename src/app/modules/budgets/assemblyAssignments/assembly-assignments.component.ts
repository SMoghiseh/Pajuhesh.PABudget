import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  AssemblyAssignments,
  Company,
  Pagination,
  PlanningValue,
  UrlBuilder,
} from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-assembly-assignments',
  templateUrl: './assembly-assignments.component.html',
  styleUrls: ['./assembly-assignments.component.scss'],
  providers: [ConfirmationService],
})
export class AssemblyAssignmentsComponent {
  // form property
  searchForm!: FormGroup;
  MeetingTopicList: any = [];
  mode!: string;
  modalTitle = '';
  addEditData = new AssemblyAssignments();
  companyList: any = [];
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  lazyLoadEvent?: LazyLoadEvent;
  totalCount!: number;
  loading = false;
  first = 0;
  data: AssemblyAssignments[] = [];
  subComponentList = [
    {
      label: 'مفاد ',
      icon: 'pi pi-fw pi-plus',
      routerLink: ['/Period/YearUnionDetail'],
    },
  ];

  isOpenAddEditAssemblyAssignment = false;
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    // this.getAssemblyAssignmentsLst();
    this.getMeetingTopicList();
    this.getCompanyLst();
    this.searchForm = new FormGroup({
      budgetPeriodId: new FormControl(),
      meetingId: new FormControl(null),
      typeCode: new FormControl(null),
      companyId: new FormControl(null),
      title: new FormControl(null),
      // meetingDate: new FormControl(),
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

  getAssemblyAssignmentList(event?: LazyLoadEvent) {
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

  addAssemblyAssignment(data: string) {
    this.modalTitle = 'افزودن تکالیف مجمع';
    this.addEditData.type = 'insert';
    this.mode = 'insert';
    this.isOpenAddEditAssemblyAssignment = true;
  }
  editRow(data: AssemblyAssignments) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditAssemblyAssignment = true;
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
        accept: () => this.deleteAssemblyAssignment(item.id, item.title),
      });
  }
  deleteAssemblyAssignment(id: number, title: string) {
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
              key: 'AssemblyAssignmen',
              life: 8000,
              severity: 'success',
              detail: `  مورد  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getAssemblyAssignmentList();
          }
        });
    }
  }

  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
  reloadData() {
    this.isOpenAddEditAssemblyAssignment = false;
    this.getAssemblyAssignmentList();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getAssemblyAssignmentList();
  }
  // Set PlanningId On Active Component Route
  setActiveComponentRoute(item: AssemblyAssignments) {
    this.subComponentList.forEach((componentInfo: any) => {
      componentInfo['routerLink'][0] =
        componentInfo['routerLink'][0] + '/' + item.id;
    });
  }
}
