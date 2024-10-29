import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder, YearPolicy, Company, TypeCode
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
  selector: 'PABudget-year-policy',
  templateUrl: './year-policy.component.html',
  styleUrls: ['./year-policy.component.scss'],
  providers: [ConfirmationService]

})
export class YearPolicyComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: YearPolicy[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditYearPolicy = false;
  addEditData = new YearPolicy();
  pId!: string;
  mode!: string;
  selectedPeriodId = 0;

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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getCompanyLst();
    this.getTypeCodeList();

    this.searchForm = new FormGroup({
      title: new FormControl(null),
      yearPolicyCode: new FormControl(null),
      companyId: new FormControl(null),
      keyTypeCode: new FormControl(null),
      aspectCode: new FormControl(null)
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

  getTypeCodeList() {
    this.httpService
      .get<TypeCode[]>(TypeCode.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
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
      periodId : this.selectedPeriodId,
      withOutPagination: false,
      ...formValue,
    };

    this.first = 0;
    const url =
      YearPolicy.apiAddress + 'List';
    this.httpService
      .post<YearPolicy[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new YearPolicy()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addYearPolicy() {
    this.modalTitle = 'افزودن سیاست  ';
    this.mode = 'insert';
    this.isOpenAddEditYearPolicy = true;
  }

  editRow(data: YearPolicy) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearPolicy = true;
  }

  deleteRow(item: YearPolicy) {
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
        accept: () => this.deleteYearPolicy(item.id, item.title),
      });
  }

  deleteYearPolicy(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<YearPolicy>(
          UrlBuilder.build(
            YearPolicy.apiAddress + 'Delete',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'YearPolicy',
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
    this.isOpenAddEditYearPolicy = false;
    this.getList();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getList();
  }
}
