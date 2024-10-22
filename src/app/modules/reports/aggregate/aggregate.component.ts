import { Component, OnInit } from '@angular/core';
import {
  AccountReportToItem,
  AccountReport,
  AccountReportItemPrice,
  Period,
  Company,
  AccountReportToItemData
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  accountReportItemList!: AccountReportToItemData;
  flattenList!: any;
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  accountReportList: any[] = [];
  selectedReport: any = {};
  isLoadingSubmit = false;
  changeList: any = [];
  formSubmitted = false;

  // dropdown data list
  companyList: any = [];
  periodList: any = [];
  periodDetailLst: Period[] = [];

  tempData = [
    {
      data: {
        name: 'Applications',
        size: '100kb',
        type: 'Folder',
      },
      children: [
        {
          data: {
            name: 'React',
            size: '25kb',
            type: 'Folder',
          },
          children: [
            {
              data: {
                name: 'react.app',
                size: '10kb',
                type: 'Application',
              },
            },
            {
              data: {
                name: 'native.app',
                size: '10kb',
                type: 'Application',
              },
            },
            {
              data: {
                name: 'mobile.app',
                size: '5kb',
                type: 'Application',
              },
            },
          ],
        },
        {
          data: {
            name: 'editor.app',
            size: '25kb',
            type: 'Application',
          },
        },
        {
          data: {
            name: 'settings.app',
            size: '50kb',
            type: 'Application',
          },
        },
      ],
    },
    {
      data: {
        name: 'Cloud',
        size: '20kb',
        type: 'Folder',
      },
      children: [],
    },
  ];

  get reportTypeCode() {
    return this.accountReportPriceForm.get('reportTypeCode');
  }
  get companyId() {
    return this.accountReportPriceForm.get('companyId');
  }
  get periodId() {
    return this.accountReportPriceForm.get('periodId');
  }
  get fromPeriodDetailId() {
    return this.accountReportPriceForm.get('fromPeriodDetailId');
  }
  get toPeriodDetailId() {
    return this.accountReportPriceForm.get('toPeriodDetailId');
  }
  get priceType() {
    return this.accountReportPriceForm.get('priceType');
  }
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    
    this.getCompanyLst();
    this.getAccountRepLst();

    this.accountReportPriceForm = new FormGroup({
      companyId: new FormControl(null, Validators.required),
      periodId: new FormControl(null, Validators.required),
      fromPeriodDetailId: new FormControl(null, Validators.required),
      toPeriodDetailId: new FormControl(null, Validators.required),
      priceType: new FormControl(2, Validators.required),
    });
  }

  getPeriodLst(companyId:number) {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown/' + companyId)
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
  onChangeCompanyId(e: any) {
    this.getPeriodLst(e.value);
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
        }
      });
  }

  getAccountReportItemLst(event?: LazyLoadEvent) {

    this.formSubmitted = true;
    if (!this.accountReportPriceForm.valid) return;

    // check if atLeast one record has changed 
    if (this.changeList?.length != 0) {
      this.confirmOnSearch();
    } else {
      this.searchOnDataList(event);
    }
  }


  searchOnDataList(event?: LazyLoadEvent) {

    const formValue = this.accountReportPriceForm.value;
    delete formValue['accountRepId'];
    delete formValue['accountReportItemPriceModels'];
    delete formValue['id'];

    const body = {
      ...formValue,
      reportId: this.selectedReport?.id,
    };

    const url =
      AccountReportToItem.apiAddress + 'GetAccountRepToItemListByOrder';
    this.httpService
      .post<AccountReportToItemData>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return new AccountReportToItemData();
        })
      )
      .subscribe(res => {
        this.accountReportItemList = res;
        this.getFlattnAccountReportList();
        this.formSubmitted = false;
      });
  }

  getFlattnAccountReportList() {
    const formValue = this.accountReportPriceForm.value;
    const body = {
      ...formValue,
      reportId: this.selectedReport?.id,
    };

    const url =
      AccountReportToItem.apiAddress + 'GetPriceAccountRepToItemList';
    this.httpService
      .post<AccountReportToItemData>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return new AccountReportToItemData();
        })
      )
      .subscribe(res => {
        this.flattenList = res;
      });
  }

  confirmOnSearch() {
    this.confirmationService.confirm({
      message: ` درصورت ادامه روند جستجو تغییرات حذف میشوند ، مایل به ذخیره تغییرات هستید ؟ `,
      header: `تغییرات ذخیره نشده اند `,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: ' ذخیره و ادامه  ',
      acceptButtonStyleClass: 'p-button-success',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'انصراف',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',
      accept: () => { this.confirm() },
      reject: () => { this.reject(); }
    });
  }

  reject() {
  }

  confirm() {
    this.addList();
    setTimeout(() => {
      this.searchOnDataList();
    }, 1000);
  }

  clearSearch() {
    this.accountReportPriceForm.reset();
    this.getAccountReportItemLst();
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
    request['accountReportItemPriceModels'] = this.changeList;

    this.isLoadingSubmit = true;
    this.httpService
      .post<AccountReportItemPrice>(url, request)
      .pipe(tap(() => (this.isLoadingSubmit = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'aggregate',
            life: 8000,
            severity: 'success',
            // detail: ` عنوان  ${request.title}`,
            detail: ``,
            summary: 'با موفقیت ثبت شد',
          });
        }
        this.changeList = [];
        this.getAccountReportItemLst();
      });

  }

  onChangePrice(item: any) {
    const fltr = this.changeList.filter(
      (x: any) => x.accountRepItemId === item.accountRepItemId
    );
    if (fltr.length > 0) {
      const index = this.changeList.indexOf(fltr[0]);
      if (index > -1) {
        this.changeList.splice(index, 1);
        this.changeList.push({
          accountRepItemId: item.accountRepItemId,
          priceCu: item.priceCu,
        });
      }
    } else
      this.changeList.push({
        accountRepItemId: item.accountRepItemId,
        priceCu: item.priceCu,
        // groupId: item.parentId ? item.parentId : item.id
      });


    this.calculateTotalPrice(item);
    this.updateBaseData(item);
  }

  updateBaseData(ItemChanged: any) {
    let indexToUpdate = this.flattenList.findIndex((item: any) =>
      item.accountRepItemId === ItemChanged.accountRepItemId);
    if (indexToUpdate != -1)
      this.flattenList[indexToUpdate]['priceCu'] = ItemChanged.priceCu;
  }

  calculateTotalPrice(item: any) {
    let parentNode: any

    // when node changed is child
    if (item.parentId) {
      parentNode = this.accountReportItemList['body'].find(rec => rec.data.id == item.parentId)?.data;
    }
    // else {
    //   // when node changed is parent 
    //   parentNode = this.accountReportItemList['body'].find(rec => rec.data.id == item.id);
    // }

    // let previousValue = (this.flattenList.find((li: any) => li.accountRepItemId == item.accountRepItemId))?.priceCu;
    // let currentValue = item.priceCu ? item.priceCu : 0;

    // let amount = 0;
    // if (previousValue > currentValue)
    //   amount = -(previousValue - currentValue);
    // else if (previousValue < currentValue)
    //   amount = currentValue - previousValue;


    // parentNode['priceCu'] = parentNode['priceCu'] + amount;

  }

  addAccountReportToItem(report: AccountReport) {
    this.router.navigate(['/Reports/AggregateCreate/' + report.id]);
  }

  openDialog(e: any) { }
}
