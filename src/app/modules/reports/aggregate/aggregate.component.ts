import { Component, OnInit } from '@angular/core';
import {
  Pagination, AccountReportToItem,
  AccountReport,
  AccountReportItemPrice,
  Period,
  Company
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
  // periodTypeList: any = [];
  // reportTypeCodeList: any = [];
  accountReportList: any[] = [];
  accountReportItemPriceModels: any[] = [];
  selectedReport: any;
  isLoadingSubmit = false;
  value: any;
  updateAtLeastOneInputValue = false;
  cols = [
    { field: "accountRepTitle", header: "عنوان آیتم" },
    { field: "priceCu", header: "مبلغ" },
  ];


  // dropdown data list
  companyList: any = [];
  periodList: any = [];
  periodDetailLst: Period[] = [];

  get reportTypeCode() {
    return this.accountReportPriceForm.get('reportTypeCode');
  }
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {


  }

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCompanyLst();
    this.getAccountRepLst();

    this.accountReportPriceForm = new FormGroup({
      companyId: new FormControl(null),
      periodId: new FormControl(null),
      fromPeriodDetailId: new FormControl(null),
      toPeriodDetailId: new FormControl(null),
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
      .post<AccountReport[]>(AccountReport.apiAddressList, { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportList = response.data.result;


          // set selected report 
          this.selectedReport = this.accountReportList.find((item) =>
            item.id == Number(this.route.snapshot.paramMap.get('id'))
          )
          // get AccountReportItemLst
          this.getAccountReportItemLst();
        }
      });
  }



  getAccountReportItemLst(event?: LazyLoadEvent) {
    debugger
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
      // ...formValue,
      reportId: this.selectedReport?.id
    };

    this.first = 0;
    const url = AccountReportToItem.apiAddress + 'GetAccountRepToItemListByOrder';
    this.httpService
      .post<AccountReportToItem[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            // if (response.data.totalCount)
            //   this.totalCount = response.data.totalCount;
            this.totalCount = response.data.result.length;
            return response.data.result;
          } else return [new AccountReportToItem()];
        })
      )
      .subscribe(res => {
        this.accountReportItemList = res;
        // this.accountReportItemList = [
        //   {
        //     accountRepItemTitle: 'title',
        //     priceCu: 1000
        //   }
        // ]
        // this.createFormControls(this.accountReportItemList);
        // this.updateFormControlValue(this.accountReportItemList);
      });
  }


  createFormControls(data: any) {
    data.forEach((item: any) => {
      this.dynamicControls.addControl('control_' + item.id, new FormControl(null));
    });
  }

  updateFormControlValue(data: any) {
    data.forEach((element: any) => {
      this.dynamicControls.controls['control_' + element.id].patchValue(element.priceCu);
    });
  }


  clearSearch() {
    this.accountReportPriceForm.reset();
    this.getAccountReportItemLst();
  }


  addList() {
    const url = AccountReportItemPrice.apiAddress + 'AggregateCreate';
    const request = this.accountReportPriceForm.value;
    request.id = 0;
    request.accountRepId = this.selectedReport.id;
    request['accountReportItemPriceModels'] = this.accountReportItemList;  // filter data on updatedstatus 


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
            summary: 'با موفقیت ثبت شد'
          });
        }
        this.getAccountReportItemLst();
      });
  }

  onChangePrice(item: any) {
    debugger
    // find item selected from list 
    // add property updated to it
  }


  updateValue(event: Event, item: any) {
    // event.stopPropagation()
    // event.preventDefault();

    this.updateAtLeastOneInputValue = true;

    let inputValue = Number(this.dynamicControls.controls[`control_${item.id}`].value);
    let indexOfObj = this.accountReportItemPriceModels.findIndex(recored => item.accountReportItemId
      == recored.accountReportItemId
    );
    // update
    if (indexOfObj != -1) {
      this.accountReportItemPriceModels[indexOfObj].accountReportItemId = inputValue;
    } else {

      // add 
      this.accountReportItemPriceModels.push({
        accountReportItemId: item.accountRepItemId,
        priceCu: inputValue
      })
    }

  }


  addAccountReportToItem(report: AccountReport) {
    this.router.navigate(['/Reports/AggregateCreate/' + report.id]);
  }

  onPage($event: any) {
    if (!this.updateAtLeastOneInputValue) return;
    this.confirmationService.confirm({
      message: 'لطفا تغییرات خود را ذخیره نمایید . آیا مایل به ادامه هستید ؟  ',
      header: `تغییراتی اعمال شده است`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'تایید',
      acceptButtonStyleClass: 'p-button-danger',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'انصراف',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',
      accept: () => { this.addList() },
      reject: () => {
        this.first = 0
      }
    });
  }
}
