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
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAspectCodeLst();
    this.getCompanyLst();
    this.getBigGoalList();

    this.searchForm = new FormGroup({
      title: new FormControl(null),
      yearGoalCode: new FormControl(null),
      companyId: new FormControl(null),
      bigGoalId: new FormControl(null),
      aspectCode: new FormControl(null),
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

  getBigGoalList() {
    this.httpService
      .post<BigGoal[]>(BigGoal.apiAddress + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }

  getAspectCodeLst() { debugger
    this.httpService
      .get<Aspect[]>(Aspect.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.aspectCodeList = response.data.result;
        }
      });
  }

  getList(event?: LazyLoadEvent) { debugger
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



  addYearGoal() { debugger
    this.modalTitle = 'افزودن  ';
    this.mode = 'insert';
    this.isOpenAddEditYearGoal = true;
  }

  editRow(data: YearGoal) { debugger
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearGoal = true;
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

  deleteYearGoal(id: number, title: string) { debugger
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

  reloadData() { debugger
    this.isOpenAddEditYearGoal = false;
    this.getList();
  }

  clearSearch() {debugger        
    this.searchForm.reset();
    this.getList();
  }
}
