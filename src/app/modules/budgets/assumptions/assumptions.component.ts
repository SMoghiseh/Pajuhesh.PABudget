import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder, Assumptions, Company, TypeCodeAssumptions
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'PABudget-assumptions',
  templateUrl: './assumptions.component.html',
  styleUrls: ['./assumptions.component.scss'],
  providers: [ConfirmationService]
})
export class AssumptionsComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Assumptions[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditAssumptions = false;
  addEditData = new Assumptions();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  budgetPeriodList: any = [];
  aspectCodeList: any = [];
  companyList: any = [];
  typeCodeList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {

    this.getCompanyLst();
    this.getTypeCodeList();

    this.searchForm = new FormGroup({
      title: new FormControl(null),
      assumptionsCode: new FormControl(null),
      companyId: new FormControl(null),
      typeCode: new FormControl(null),
      aspectCode: new FormControl(null)
    });

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

  getTypeCodeList() {
    this.httpService
      .get<TypeCodeAssumptions[]>(TypeCodeAssumptions.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
        }
      });
  }


  getList(event?: LazyLoadEvent) {debugger
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
      Assumptions.apiAddress + 'List';
    this.httpService
      .post<Assumptions[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Assumptions()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addAssumptions() {debugger
    this.modalTitle = 'افزودن ماموریت  ';
    this.mode = 'insert';
    this.isOpenAddEditAssumptions = true;
  }

  editRow(data: Assumptions) {debugger
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditAssumptions = true;
  }

  deleteRow(item: Assumptions) {
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
        accept: () => this.deleteAssumptions(item.id, item.title),
      });
  }

  deleteAssumptions(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<Assumptions>(
          UrlBuilder.build(
            Assumptions.apiAddress + 'Delete',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'Assumptions',
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

  reloadData() {debugger
    this.isOpenAddEditAssumptions = false;
    this.getList();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getList();
  }
}
