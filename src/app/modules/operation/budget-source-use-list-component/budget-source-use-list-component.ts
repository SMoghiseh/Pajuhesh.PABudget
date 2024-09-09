import { Component, OnInit } from '@angular/core';
import {
  Pagination, Period,
  Company,
  BudgetSourceUse
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'PABudget-budget-source-use-list',
  templateUrl: './budget-source-use-list-component.html',
  styleUrls: ['./budget-source-use-list-component.scss'],
  providers: [ConfirmationService],
})
export class BudgetSourceUseListComponent implements OnInit {
  budgetSourceUseForm!: FormGroup;
  dynamicControls: FormGroup = new FormGroup({});
  gridClass = 'p-datatable-sm';
  dataTableRows = 5;
  totalCount!: number;
  budgetSourceUseList: any[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  budgetSourceUseLst: any[] = [];
  selectedReport: any;
  isLoadingSubmit = false;

  // dropdown data list
  companyList: any = [];
  periodList: any = [];
  periodDetailLst: Period[] = [];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCompanyLst();
    // this.getAccountRepLst();

    this.budgetSourceUseForm = new FormGroup({
      companyId: new FormControl(0),
      periodId: new FormControl(null),
      periodDetailId: new FormControl(null),
    });
  }

  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodList = response.data.result;
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

  onChangePeriod(e: any) {
    this.getPeriodDetailLst(e.value);
  }

  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailLst = response.data.result;
        }
      });
  }
  // getAccountRepLst() {
  //   this.httpService
  //     .post<AccountReport[]>(AccountReport.apiAddressList, {
  //       withOutPagination: true,
  //     })
  //     .subscribe(response => {
  //       if (response.data && response.data.result) {
  //         this.budgetSourceUseLst = response.data.result;

  //         this.getBudgetSourceUseLst();
  //       }
  //     });
  // }

  getBudgetSourceUseLst(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.budgetSourceUseForm.value;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      // pageSize: pagination.pageSize,
      // pageNumber: pagination.pageNumber,
      // withOutPagination: false,
      ...formValue
    };

    this.first = 0;
    const url =
      BudgetSourceUse.apiAddressGroupList;
    this.httpService
      .post<BudgetSourceUse[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            this.totalCount = response.data.result.length;
            return response.data.result;
          } else return [new BudgetSourceUse()];
        })
      )
      .subscribe(res => {
        this.budgetSourceUseList = res;
        this.budgetSourceUseList = res.map(item => ({
          title: item.title,
          id: item.id,
          code: item.code,
          // just for shownig in inputs value 
          realPriceCu: item.realPriceCu ? item.realPriceCu : '0',
          budgetPriceCu: item.budgetPriceCu ? item.budgetPriceCu : '0'
        }))
      });
  }

  clearSearch() {
    this.budgetSourceUseForm.reset();
    this.getBudgetSourceUseLst();
  }

  convertData() {
    const data = this.budgetSourceUseList.filter(item => item.updated);
    return data.map(item => ({
      sourceUseTypeId: item.id,
      budgetPriceCu: Number(item.budgetPriceCu),
      realPriceCu: Number(item.realPriceCu)
    }));
  }

  addList() {
    const url = BudgetSourceUse.apiAddressGroupAddOrUpdate;
    const request = this.budgetSourceUseForm.value;

    // data to post
    request.companyId = request.companyId ? request.companyId : 0;
    request.periodDetailId = request.periodDetailId
      ? request.periodDetailId
      : 0;
    request.periodId = request.periodId ? request.periodId : 0;
    request['sourceUsePrice'] = this.convertData();

    this.isLoadingSubmit = true;
    this.httpService
      .post<BudgetSourceUse>(url, request)
      .pipe(tap(() => (this.isLoadingSubmit = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'budgetSource',
            life: 8000,
            severity: 'success',
            detail: ` `,
            summary: 'با موفقیت ثبت شد',
          });
        }
        this.getBudgetSourceUseLst();
      });
  }

  onChangePrice(item: any) {
    // find item selected from list
    const object = this.budgetSourceUseList.find(
      record => record.id == item.id
    );
    // add property updated to it
    object['updated'] = true;
  }


}
