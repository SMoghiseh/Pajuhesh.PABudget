import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountReportItem, AccountReportItemPrice, Company, Period, ProductGroup } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-add-edit-account-report-item-price',
  templateUrl: './add-edit-account-report-item-price.component.html',
  styleUrls: ['./add-edit-account-report-item-price.component.scss'],
})
export class AddEditAccountReportItemPriceComponent implements OnInit {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  accountReportItemList: any = [];
  companyList: any = [];
  periodList: any = [];
  periodDetailLst: Period[] = [];
  

  inputData = new AccountReportItemPrice();
  @Input() mode = '';
  @Input() set data(data: AccountReportItemPrice) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get accountReportItemId() {
    return this.addEditForm.get('accountReportItemId');
  }

  get companyId() {
    return this.addEditForm.get('companyId');
  }

  get budgetPeriodId() {
    return this.addEditForm.get('budgetPeriodId');
  }

  get periodId() {
    return this.addEditForm.get('periodId');
  }
  get fromPeriodDetailId() {
    return this.addEditForm.get('fromPeriodDetailId');
  }
  get toPeriodDetailId() {
    return this.addEditForm.get('toPeriodDetailId');
  }
  get priceCu() {
    return this.addEditForm.get('priceCu');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    
    this.getAccountReportItemLst();
    this.getPeriodLst();
    this.getCompanyLst();

    this.addEditForm = new FormGroup({
      accountReportItemId: new FormControl('', Validators.required),
      companyId: new FormControl('', Validators.required),
      periodId: new FormControl('', Validators.required),
      fromPeriodDetailId: new FormControl('', Validators.required),
      toPeriodDetailId: new FormControl('', Validators.required),
      priceCu: new FormControl(this.inputData.priceCu, Validators.required)
 
    });

    if (this.mode === 'edit') {
      this.getPeriodDetailLst(this.inputData.periodId);
      this.getRowData(this.inputData.id);
    }
  }

  addEditReport() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request: AccountReportItemPrice = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = this.mode === 'insert' ? AccountReportItemPrice.apiAddress + 'CreateAccountReportItemPrice' :
        AccountReportItemPrice.apiAddress + 'UpdateAccountReportItemPrice';
      this.isLoadingSubmit = true;

      this.httpService
        .post<AccountReportItemPrice>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'report',
              life: 8000,
              severity: 'success',
              detail: ` نوع فروش`,
              summary:
                this.mode === 'insert'
                  ? 'با موفقیت درج شد'
                  : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }

  getAccountReportItemLst() {
    this.httpService
      .get<AccountReportItem[]>(AccountReportItem.apiAddress + 'GetAllAccountReportItems')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportItemList = response.data.result;
        }
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
      .post<Company[]>(Company.apiAddressDetailCo + 'List' , { 'withOutPagination' : true})
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
          if (this.inputData.id)
            this.addEditForm.patchValue({
              fromPeriodDetailId: this.inputData.fromPeriodDetailId,
              toPeriodDetailId: this.inputData.toPeriodDetailId,
            });
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(AccountReportItemPrice.apiAddress + 'GetAccountReportItemPriceById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }





}
