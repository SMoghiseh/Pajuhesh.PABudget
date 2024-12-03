import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AccountReportToItem,
  AccountReport,
  AccountReportItemPrice,
  Period,
  Company,
  AccountReportToItemData,
  AttachmentType,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, of, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

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
  loadFile = false;
  accountReportList: any[] = [];
  selectedReport: any = {};
  isLoadingSubmit = false;
  changeList: any = [];
  formSubmitted = false;
  dataFetched = false;
  downloadPriceAccountRepList: any;
  addBuggetBreakingModal = false;
  selectedMonthItem: any;
  rowSelected: any;
  btnDownload: any;
  uploadFile: any;
  btnDis = true;
  AdditionalTextForColumn = '';
  IsBreakingBudgeVisibile = false;
  // dropdown data list
  companyList: any = [];
  priceAccountRepToItemFromExcelFile: any;
  periodList: any = [];
  monthList: any = [];
  periodDetailLst: Period[] = [];
  @ViewChild('form') fileUpload!: FileUpload;
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
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getCompanyLst();
    this.getAccountRepLst();

    this.accountReportPriceForm = new FormGroup({
      companyId: new FormControl(null, Validators.required),
      periodId: new FormControl(null, Validators.required),
      fromPeriodDetailId: new FormControl(null, Validators.required),
      toPeriodDetailId: new FormControl(null, Validators.required),
      priceType: new FormControl(null, Validators.required),
    });

    // this.accountReportPriceForm.valueChanges.pipe(pairwise())
    //   .subscribe(([prev, next]: [any, any]) => {
    //     // check if atLeast one record has changed
    //     Object.keys(prev).forEach(controlName => {
    //       const control = this.accountReportPriceForm.get(controlName);
    //       const prevValue = prev[controlName];

    //       // Update the control with the reversed value
    //       control?.setValue(prevValue, { emitEvent: false });
    //     });
    //   });

    // this.accountReportPriceForm.valueChanges
    // .subscribe(([prev, next]: [any, any]) => {
    //   Object.keys(prev).forEach(controlName => {
    //     const control = this.accountReportPriceForm.get(controlName);
    //     const currentValue = prev[controlName];

    //     // Reverse the value
    //     const reversedValue = prev['controlName'];

    //     // Update the control with the reversed value
    //     control?.setValue(reversedValue, { emitEvent: false });
    //   });
    // });

    /////
  }

  getPeriodLst(companyId: number) {
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

  getmonthList() {
    const data = {
      accountRepItemId: this.rowSelected.id,
      companyId: this.accountReportPriceForm.value['companyId'],
      periodId: this.accountReportPriceForm.value['periodId'],
    };
    this.httpService
      .post<AccountReportItemPrice[]>(
        AccountReportItemPrice.apiAddress + 'GetBudgetBreaking',
        data
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.monthList = response.data.result;
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
    // if (this.changeList?.length != 0) {
    //
    //   this.confirmOnSearch();
    // } else {
    this.searchOnDataList(event);
    // }
  }

  downloadExcelFile() {
    if (this.btnDis == false) {
      this.loadFile = true;
      const formValue = this.accountReportPriceForm.value;
      this.formSubmitted = true;
      const body = {
        ...formValue,
        reportId: this.selectedReport?.id,
      };
      const url =
        AccountReportToItem.apiAddress +
        'DownloadPriceAccountRepToItemExcelFile';
      this.httpService.post<AccountReportToItem>(url, body).subscribe(res => {
        if (res.successed) {
          const a = document.createElement('a'); //Create <a>
          a.href = 'data:application/octet-stream;base64,' + res.data.result; //Image Base64 Goes here
          a.download = res.data.fileName || ''; //File name Here
          a.click(); //Downloaded file
        }
        this.loadFile = false;
      });
    }
  }

  onSelectAttachment(files: FileList) {
    const File = files[0].name;
    if (files.length) {
      this.onBeforeUpload();
      Array.from(files).forEach(file => {
        const data = new FormData();
        data.append('File', file);

        if (file.size <= 25000000)
          return this.httpService
            .post<any>(AttachmentType.apiAddressUpload, data)
            .subscribe(response => {
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'attachmentTypeDefinition',
                  life: 8000,
                  severity: 'success',
                  summary: 'فایل با موفقیت بارگذاری شد',
                });
                // this.accountReportPriceForm.patchValue({
                //   tempPath: fileName,
                // });
                this.uploadFile = response.data.result.multiMediaId;
                this.ReadPriceAccountFromExcelFile(this.uploadFile);
              }
              this.onUpload();
            });
        else return of();
      });
    }
  }

  ReadPriceAccountFromExcelFile(multiMediaIdId: number) {  
    this.httpService
      .get<AccountReportToItem[]>(
        AccountReportToItem.apiAddress +
          'ReadPriceAccountRepToItemFromExcelFile/' +
          multiMediaIdId
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.priceAccountRepToItemFromExcelFile = response.data.result;
        }
        this.changeList = [];
        for (let i = 0; i < this.flattenList.length; i++) {
          //
          if (
            this.flattenList[i].accountRepItemId ===
            this.priceAccountRepToItemFromExcelFile[i].accountRepItemId
          ) {
            //upload child data from excel to form
            if (this.accountReportItemList.body[i].data.hasChild === true) {
              const childArray = this.accountReportItemList.body[i].children;
              for (let j = 0; j < childArray.length; j++) {
                for (let k = 0; k < this.flattenList.length; k++) {
                  const reportItem =
                    this.accountReportItemList.body[i].children[j].data
                      .accountRepItemId;
                  if (this.flattenList[k].accountRepItemId === reportItem) {
                    this.accountReportItemList.body[i].children[
                      j
                    ].data.priceCu =
                      this.priceAccountRepToItemFromExcelFile[k].priceCu;
                  }
                }
              }
              //---upload child data from excel to form
            } else {
              this.accountReportItemList.body[i].data.priceCu =
                this.priceAccountRepToItemFromExcelFile[i].priceCu;
            }
            this.changeList.push({
              accountRepItemId:
                this.priceAccountRepToItemFromExcelFile[i].accountRepItemId,
              priceCu: this.priceAccountRepToItemFromExcelFile[i].priceCu,

              // groupId: item.parentId ? item.parentId : item.id
            });
            // this.flattenList[i].priceCu =
            //   this.priceAccountRepToItemFromExcelFile[i].priceCu;
          }
        }
        
      });
      this.fileUpload.clear();
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
        this.getAdditionalTextForColumn();
        this.changeButtonsDisablity();
        this.changeBreakingBudgeVisibility();
        this.formSubmitted = false;

        if (this.accountReportItemList.body.length != 0)
          this.accountReportPriceForm.disable();
      });
  }

  changeBreakingBudgeVisibility() {
    this.IsBreakingBudgeVisibile = this.priceType?.value == 2 ? false : true;
  }

  getAdditionalTextForColumn() {
    this.AdditionalTextForColumn =
      this.priceType?.value == 2 ? 'عملکرد' : 'بودجه';
  }

  changeButtonsDisablity() {
    if (
      this.accountReportItemList.body.length &&
      this.accountReportPriceForm.valid
    ) {
      this.btnDis = false;
    } else this.btnDis = true;
  }

  getFlattnAccountReportList() {
    const formValue = this.accountReportPriceForm.value;
    const body = {
      ...formValue,
      reportId: this.selectedReport?.id,
    };

    const url = AccountReportToItem.apiAddress + 'GetPriceAccountRepToItemList';
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
      accept: () => {
        this.confirm();
      },
      reject: () => {
        this.reject();
      },
    });
  }

  reject() {}

  onBeforeUpload(): void {
    this.loading = true; // Show loading indicator
  }
  onUpload(): void {
    this.loading = false; // Hide loading indicator after upload
  }
  confirm() {
    this.addList();
    setTimeout(() => {
      this.searchOnDataList();
    }, 1000);
  }

  clearSearch() {
    this.accountReportPriceForm.enable();
    this.accountReportPriceForm.reset();
    // Clear validators for each control
    Object.keys(this.accountReportPriceForm.controls).forEach(key => {
      this.accountReportPriceForm.get(key)?.clearValidators();
      this.accountReportPriceForm.get(key)?.updateValueAndValidity();
    });
    this.formSubmitted = false;
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

    item['changePrice'] = true;
    this.calculateTotalPrice(item);
    this.updateBaseData(item);
  }

  updateBaseData(ItemChanged: any) {
    const indexToUpdate = this.flattenList.findIndex(
      (item: any) => item.accountRepItemId === ItemChanged.accountRepItemId
    );
    if (indexToUpdate != -1)
      this.flattenList[indexToUpdate]['priceCu'] = ItemChanged.priceCu;
  }

  calculateTotalPrice(item: any) {
    let parentNode: any;

    // when node changed is child
    if (item.parentId) {
      parentNode = this.accountReportItemList['body'].find(
        rec => rec.data.id == item.parentId
      )?.data;
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

  onOpenBreakingBudgeDialog(item: any) {
    this.addBuggetBreakingModal = true;
    this.rowSelected = item;
    this.getmonthList();
  }

  onSelectMonthItem(item: any) {
    this.selectedMonthItem = item;
  }

  onChangePercent(item: any) {
    item['changed'] = true;
  }

  addPercentageList() {
    const percentageList = this.monthList.map((item: { percentage: any }) => {
      return item.percentage ? Number(item.percentage) : 0;
    });
    let sum = 0;
    percentageList.forEach((element: any) => {
      sum = sum + element;
    });
    if (sum != 100) {
      this.messageService.add({
        key: 'aggregate',
        life: 8000,
        severity: 'error',
        detail: ``,
        summary: 'جمع درصد های وارد شده برابر 100 نیست',
      });
      return;
    }

    let finalList = this.monthList.filter(
      (item: { changed: boolean }) => item.changed == true
    );
    finalList = finalList.map((item: { id: any; percentage: any }) => {
      return { id: item.id, percentage: Number(item.percentage) };
    });

    const data = {
      budgetPrice: this.rowSelected.priceCu,
      periodpercentage: finalList,
    };

    this.httpService
      .post<AccountReportItemPrice>(
        AccountReportItemPrice.apiAddress + 'CreateBudgetBreaking',
        data
      )
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
          this.addBuggetBreakingModal = false;
        }
      });
  }

  openDialog(e: any) {}
}
