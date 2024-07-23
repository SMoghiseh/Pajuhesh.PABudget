import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountReport, AccountReportItem, AccountReportToItem, Company } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-account-report-to-item',
  templateUrl: './add-edit-account-report-to-item.component.html',
  styleUrls: ['./add-edit-account-report-to-item.component.scss'],
})
export class AddEditAccountReportToItemComponent implements OnInit {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  accountReportItemList: any = [];
  companyList: any = [];
  accountReportLst: any = [];

  isInFilteredMode = false;


  inputData = new AccountReportToItem();
  @Input() set data1(data: AccountReportToItem) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get accountRepId() {
    return this.addEditForm.get('accountRepId');
  }

  get companyId() {
    return this.addEditForm.get('companyId');
  }

  get accountRepItemId() {
    return this.addEditForm.get('accountRepItemId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getAccountReportItemLst();
    this.getAccountReportLst();
    this.getCompanyLst();

    this.addEditForm = new FormGroup({
      accountRepId: new FormControl('', Validators.required),
      companyId: new FormControl(''),
      accountRepItemId: new FormControl('', Validators.required)
    });

    this.route.params.subscribe((param: any) => {
      if (param.id) {
        this.isInFilteredMode = true;
        this.addEditForm.patchValue({
          accountRepId: Number(param.id)
        })
      }
    });
  }

  addEditReport() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request: AccountReportToItem = this.addEditForm.value;
      const url = AccountReportToItem.apiAddress + 'create';
      this.isLoadingSubmit = true;

      this.httpService
        .post<AccountReportToItem>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'report',
              life: 8000,
              severity: 'success',
              detail: ` نوع فروش`,
              summary: 'با موفقیت درج شد'
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }

  getAccountReportItemLst() {
    this.httpService
      .post<AccountReportItem[]>(AccountReportItem.apiAddress + 'list' , {
        "withOutPagination": true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportItemList = response.data.result;
        }
      });
  }

  getAccountReportLst() {
    this.httpService
      .post<AccountReport[]>(AccountReport.apiAddress + 'GetAllAccountReport', { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportLst = response.data.result;
        }
      });
  }

  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }


  getRowData(id: number) {
    this.httpService
      .get<any>(AccountReportToItem.apiAddress + 'GetAccountReportItemById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }





}
