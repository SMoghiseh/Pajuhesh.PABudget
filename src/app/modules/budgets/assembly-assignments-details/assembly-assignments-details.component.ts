import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  providers: [ConfirmationService],
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
  inputData = new AssemblyAssignments();
  isOpenAddEditAssemblyAssignmentsDetails = false;
  TypeCodeList: any = [];
  // form property
  searchForm!: FormGroup;

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTypeCodeList();
    debugger;
    this.searchForm = new FormGroup({
      yearUnionId: new FormControl(),
      typeCode: new FormControl(null),
      title: new FormControl(null),
    });

    this.route.params.subscribe((param: any) => {
      debugger;
      if (param.id) {
        this.searchForm.patchValue({
          yearUnionId: param.id,
        });
      }
    });
  }

  addAssemblyAssignmentsDetails() {
    this.modalTitle = 'افزودن مفاد ';
    this.mode = 'insert';
    this.isOpenAddEditAssemblyAssignmentsDetails = true;
  }

  editRow(data: AssemblyAssignments) {
    debugger;

    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditAssemblyAssignmentsDetails = true;
  }
  deleteRow(item: AssemblyAssignments) {
    debugger;
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

  getTypeCodeList() {
    this.httpService
      .get<AssemblyAssignments[]>(
        AssemblyAssignments.apiAddressTypeCode + 'List',
        {
          withOutPagination: true,
        }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.TypeCodeList = response.data.result;
        }
      });
  }
  getRowData(id: number) {
    debugger;
    this.httpService
      .get<any>(AssemblyAssignments.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.searchForm.patchValue(response.data.result);
        }
      });
  }

  deleteAssemblyAssignmentsDetails(id: number, title: string) {
    debugger;
    if (id && title) {
      this.httpService
        .get<AssemblyAssignments>(
          UrlBuilder.build(
            AssemblyAssignments.apiAddressDetails + 'Delete',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'assemblyAssignmentDetails',
              life: 8000,
              severity: 'success',
              detail: ` مفاد  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getAssemblyAssignmentsDetails();
          }
        });
    }
  }
  getAssemblyAssignmentsDetails(event?: LazyLoadEvent) {
    debugger;
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
    const url = AssemblyAssignments.apiAddressDetails + 'List';
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
    debugger;
    this.isOpenAddEditAssemblyAssignmentsDetails = false;
    this.getAssemblyAssignmentsDetails();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getAssemblyAssignmentsDetails();
  }
}
