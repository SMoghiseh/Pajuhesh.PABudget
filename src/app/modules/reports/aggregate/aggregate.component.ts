import { Component, OnInit } from '@angular/core';
import {
  Pagination,
  AccountReportToItem,
  AccountReport,
  AccountReportItemPrice,
  Period,
  Company,
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
  selector: 'PABudget-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.scss'],
  providers: [ConfirmationService],
})
export class AggregateComponent implements OnInit {
  accountReportPriceForm!: FormGroup;
  dynamicControls: FormGroup = new FormGroup({});
  gridClass = 'p-datatable-sm';
  dataTableRows = 5;
  totalCount!: number;
  accountReportItemList: any[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  accountReportList: any[] = [];
  selectedReport: any;
  isLoadingSubmit = false;

  // dropdown data list
  companyList: any = [];
  periodList: any = [];
  periodDetailLst: Period[] = [];

  get reportTypeCode() {
    return this.accountReportPriceForm.get('reportTypeCode');
  }
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCompanyLst();
    this.getAccountRepLst();

    this.accountReportPriceForm = new FormGroup({
      companyId: new FormControl(0),
      periodId: new FormControl(null),
      fromPeriodDetailId: new FormControl(null),
      toPeriodDetailId: new FormControl(null),
      priceType: new FormControl(2),
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
      .post<Company[]>(Company.apiAddressDetailCo + 'List', {
        withOutPagination: true,
      })
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
  getAccountRepLst() {
    this.httpService
      .post<AccountReport[]>(AccountReport.apiAddressList, {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportList = response.data.result;

          // set selected report
          this.selectedReport = this.accountReportList.find(
            item => item.id == Number(this.route.snapshot.paramMap.get('id'))
          );
          // get AccountReportItemLst
          this.getAccountReportItemLst();
        }
      });
  }

  getAccountReportItemLst(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.accountReportPriceForm.value;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      ...formValue,
      reportId: this.selectedReport?.id,
    };

    this.first = 0;
    const url =
      AccountReportToItem.apiAddress + 'GetAccountRepToItemListByOrder';
    this.httpService
      .post<AccountReportToItem[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            this.totalCount = response.data.result.length;
            return response.data.result;
          } else return [new AccountReportToItem()];
        })
      )
      .subscribe(res => {
        this.accountReportItemList = res;
      });
  }

  createFormControls(data: any) {
    data.forEach((item: any) => {
      this.dynamicControls.addControl(
        'control_' + item.id,
        new FormControl(null)
      );
    });
  }

  updateFormControlValue(data: any) {
    data.forEach((element: any) => {
      this.dynamicControls.controls['control_' + element.id].patchValue(
        element.priceCu
      );
    });
  }

  clearSearch() {
    this.accountReportPriceForm.reset();
    this.getAccountReportItemLst();
  }

  convertData() {
    const data = this.accountReportItemList.filter(item => item.updated);
    return data.map(item => ({
      accountRepItemId: item.accountRepItemId,
      priceCu: item.priceCu,
    }));
  }

  addList() {
    const url = AccountReportItemPrice.apiAddress + 'AggregateCreate';
    const request = this.accountReportPriceForm.value;

    // data to post
    request.id = 0;
    request.accountRepId = this.selectedReport.id;
    request.companyId = request.companyId ? request.companyId : 0;
    request.fromPeriodDetailId = request.fromPeriodDetailId
      ? request.fromPeriodDetailId
      : 0;
    request.toPeriodDetailId = request.toPeriodDetailId
      ? request.toPeriodDetailId
      : 0;
    request.periodId = request.periodId ? request.periodId : 0;
    request['accountReportItemPriceModels'] = this.convertData();

    this.isLoadingSubmit = true;
    this.httpService
      .post<AccountReportItemPrice>(url, request)
      .pipe(tap(() => (this.isLoadingSubmit = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'vision',
            life: 8000,
            severity: 'success',
            detail: ` عنوان  ${request.title}`,
            summary: 'با موفقیت ثبت شد',
          });
        }
        this.getAccountReportItemLst();
      });
  }

  onChangePrice(item: any) {
    // find item selected from list
    const object = this.accountReportItemList.find(
      record => record.accountRepItemId == item.accountRepItemId
    );
    // add property updated to it
    object['updated'] = true;
  }

  addAccountReportToItem(report: AccountReport) {
    this.router.navigate(['/Reports/AggregateCreate/' + report.id]);
  }

  // onPage($event: any) {
  //   if (!this.updateAtLeastOneInputValue) return;
  //   this.confirmationService.confirm({
  //     message: 'لطفا تغییرات خود را ذخیره نمایید . آیا مایل به ادامه هستید ؟  ',
  //     header: `تغییراتی اعمال شده است`,
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptLabel: 'تایید',
  //     acceptButtonStyleClass: 'p-button-danger',
  //     acceptIcon: 'pi pi-check',
  //     rejectLabel: 'انصراف',
  //     rejectButtonStyleClass: 'p-button-secondary',
  //     defaultFocus: 'reject',
  //     accept: () => { this.addList() },
  //     reject: () => {
  //       this.first = 0
  //     }
  //   });
  // }
}
