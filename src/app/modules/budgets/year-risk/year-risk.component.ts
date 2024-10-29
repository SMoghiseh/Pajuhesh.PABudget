import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder, YearRisk, Company, EvaluateIndex, KeyTypecode, Period
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
  selector: 'PABudget-year-risk',
  templateUrl: './year-risk.component.html',
  styleUrls: ['./year-risk.component.scss'],
  providers: [ConfirmationService]

})
export class YearRiskComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: YearRisk[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditYearPolicy = false;
  addEditData = new YearRisk();
  pId!: string;
  mode!: string;
  selectedPeriodId = 0;

  // form property
  searchForm!: FormGroup;

  subComponentList = [
    {
      label: ' برنامه مرتبط ریسک ',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/RelatedYearRiskProgram'],
    },
  ];

  // dropdown data list
  budgetPeriodList: any = [];
  evaluateIndexList: any = [];
  companyList: any = [];
  typeCodeList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getBudgetPeriodList();
    this.getCompanyLst();
    this.getEvaluateIndexLst();
    this.getTypeCodeList();
    this.searchForm = new FormGroup({
      title: new FormControl(null),
      yearRiskCode: new FormControl(null),
      companyId: new FormControl(null),
      evaluateIndexId: new FormControl(null),
      keyTypeCode: new FormControl(null),
      budgetPeriodId: new FormControl(null),
    });

    this.selectedPeriodId = Number(this.route.snapshot.paramMap.get('id'));

  }


  getBudgetPeriodList() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
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

  getEvaluateIndexLst() {
    this.httpService
      .post<EvaluateIndex[]>(EvaluateIndex.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.evaluateIndexList = response.data.result;
        }
      });
  }

  getTypeCodeList() {
    this.httpService
      .get<KeyTypecode[]>(KeyTypecode.yearRiskApiAddress + 'List')
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
      YearRisk.apiAddress + 'List';
    this.httpService
      .post<YearRisk[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new YearRisk()];
        })
      )
      .subscribe(res => {
        this.data = this.addSubComponentList(res);
      });
  }

  addSubComponentList(data: any) {
    data.forEach((row: any) => {

      row['componentList'] = [];
      let array = this.subComponentList;
      let snapshotParams = '/' +
        Number(this.route.snapshot.paramMap.get('id'));

      array = array.map(com => {
        let params = snapshotParams + '/' + row.id;
        let route = com['routerLink'][0].concat(params);
        return { ...com, routerLink: [route] }
      })

      row['componentList'].push(...array);

    });
    return data;
  }

  addYearPolicy() {
    this.modalTitle = 'افزودن ریسک  ';
    this.mode = 'insert';
    this.isOpenAddEditYearPolicy = true;
  }

  editRow(data: YearRisk) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearPolicy = true;
  }

  deleteRow(item: YearRisk) {
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
        .get<YearRisk>(
          UrlBuilder.build(
            YearRisk.apiAddress + 'Delete',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'YearRisk',
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
