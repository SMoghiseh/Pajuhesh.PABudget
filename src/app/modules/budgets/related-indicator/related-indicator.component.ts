import { Component, OnInit } from '@angular/core';
import {
  Indicator,
  Pagination,
  UrlBuilder,
  YearGoal
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'PABudget-related-indicator',
  templateUrl: './related-indicator.component.html',
  styleUrls: ['./related-indicator.component.scss'],
  providers: [ConfirmationService],

})
export class RelatedIndicatorComponent implements OnInit {

  // query params property
  selectedComponent = '';
  pageTitle = '';
  apiUrl = '';
  rowSelected = 0;
  selectedCompanyId = 0;
  selectedPeriodId = 0 ;
  
  // table property 
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: YearGoal[] = [];
  isLoadingSubmit = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditYearGoal = false;
  addEditData = new YearGoal();
  pId!: string;
  mode!: string;
  selectedIndicator: any;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  relatedIndicatorList: any = [];


  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedComponent = params['page'];
      this.rowSelected = Number(params['id']);
      this.selectedCompanyId = Number(params['companyId']);
      this.selectedPeriodId = Number(params['periodId']);
    });
    this.recognizeApiUrl();

    this.getRelatedIndicatorList();
    // this.getCompanyLst();

    this.searchForm = new FormGroup({
      indicatorId: new FormControl(null),
    });

  }


  getRelatedIndicatorList() {
    const url = Indicator.apiAddressIndicator + 'GetIndicator/' + this.apiUrl;
    this.httpService
      .get<any[]>(url)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.relatedIndicatorList = response.data.result;
        }
      });
  }


  recognizeApiUrl() {
    let apiUrl = '';
    if (this.selectedComponent == 'YearGoal') {
      apiUrl = 'YearGoal';
      this.pageTitle = 'اهداف سالیانه '
    }
    if (this.selectedComponent == 'YearPolicy') {
      this.pageTitle = ' سیاست ها '
      apiUrl = 'YearPolicy';
    }
    if (this.selectedComponent == 'YearActivity') {
      this.pageTitle = 'برنامه عملیاتی'
      apiUrl = 'YearActivity';
    }
    if (this.selectedComponent == 'YearUnion') {
      this.pageTitle = 'تکالیف مجمع'
      apiUrl = 'YearUnion';
    }
    if (this.selectedComponent == 'Project') {
      this.pageTitle = 'پروژه'
      apiUrl = 'Project';
    }
    if (this.selectedComponent == 'Assumptions') {
      this.pageTitle = ' مفروضات'
      apiUrl = 'Assumptions';
    }
    if (this.selectedComponent == 'YearRisk') {
      this.pageTitle = ' ریسک '
      apiUrl = 'YearRisk';
    }
    this.apiUrl = apiUrl;
  }


  // getCompanyLst() {
  //   this.httpService
  //     .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
  //     .subscribe(response => {
  //       if (response.data && response.data.result) {
  //         this.companyList = response.data.result;
  //       }
  //     });
  // }

  // getBigGoalList(id: number) {
  //   this.httpService
  //     .post<BigGoal[]>(BigGoal.apiAddress + 'List', {
  //       withOutPagination: true,
  //       companyId: id
  //     })
  //     .subscribe(response => {
  //       if (response.data && response.data.result) {
  //         this.bigGoalList = response.data.result;
  //       }
  //     });
  // }

  // getAspectCodeLst() {
  //   this.httpService
  //     .get<Aspect[]>(Aspect.apiAddress + 'List')
  //     .subscribe(response => {
  //       if (response.data && response.data.result) {
  //         this.aspectCodeList = response.data.result;
  //       }
  //     });
  // }

  // onChangeCompany(e: any) {
  //   this.getBigGoalList(e.value)
  // }


  submit() {
    if (!this.selectedIndicator) return;

    const request = {
      id: 0,
      refrenceId: this.rowSelected,
      slaveRefrenceTypeId: this.selectedIndicator.slaveRefrenceTypeId,
      indicatorId: this.selectedIndicator.indicatorId
    };
    const url = Indicator.apiAddressIndicator + 'CreateRefrenceOfIndicators';

    this.isLoadingSubmit = true;
    this.httpService
      .post<any>(url, request)
      .pipe(tap(() => (this.isLoadingSubmit = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'message',
            life: 8000,
            severity: 'success',
            detail: '',
            summary: 'با موفقیت درج شد'
          });
          this.getList();
        }
      });

  }


  getList(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      refrenceId: this.rowSelected,
    };

    this.first = 0;
    // const url = Indicator.apiAddressIndicator + 'getIndicatorTo' + this.apiUrl + 'List';
    // change 
    const url = Indicator.apiAddressIndicator + 'AddYearUnionIndicator';
    this.httpService
      .post<any[]>(url, body)
      .pipe(
        tap(() => (this.isLoadingSubmit = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.data = res;
      });
  }

  addYearGoal() {
    this.modalTitle = 'افزودن  ';
    this.mode = 'insert';
    this.isOpenAddEditYearGoal = true;
  }

  editRow(data: YearGoal) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditYearGoal = true;
  }


  deleteRow(item: YearGoal) {
    return;
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

  deleteYearGoal(id: number, title: string) {
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

  reloadData() {
    this.isOpenAddEditYearGoal = false;
    this.getList();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getList();
  }

  setValueOnIndicators(item: any) {
    this.router.navigate(['Period/RelatedIndicator/' + item.indicatorId] , 
    { queryParams: { referenceId : item.referenceId , companyId: this.selectedCompanyId , periodId: this.selectedPeriodId } })
  }

}
