import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AccountReport,
  AccountReportType,
  Company,
  Period,
  PeriodBudgetType,
  ReportItemType,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-add-edit-account-report',
  templateUrl: './add-edit-account-report.component.html',
  styleUrls: ['./add-edit-account-report.component.scss'],
})
export class AddEditAccountReportComponent implements OnInit {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  periodTypeList: any = [];
  reportTypeCodeList: any = [];
  reportTitleTypesList: any = [];
  companyList: any = [];

  inputData = new AccountReport();
  @Input() mode = '';
  @Input() set data(data: AccountReport) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get title() {
    return this.addEditForm.get('title');
  }
  get periodTypeCode() {
    return this.addEditForm.get('periodTypeCode');
  }
  get reportTypeCode() {
    return this.addEditForm.get('reportTypeCode');
  }
  get basicReportTypeId() {
    return this.addEditForm.get('basicReportTypeId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPeriodTypeList();
    this.getReportTypeCodeList();
    this.getReportTitleTypeList();
    this.getCompanyLst();

    this.addEditForm = new FormGroup({
      title: new FormControl(this.inputData.title, Validators.required),
      periodTypeCode: new FormControl('', Validators.required),
      reportTypeCode: new FormControl('', Validators.required),
      basicReportTypeId: new FormControl('', Validators.required),
      companyId: new FormControl(),
    });
    this.addEditForm.patchValue(this.inputData);

    //  if (this.mode === 'edit') {
    //    this.getRowData(this.inputData.id);
    //  }
  }

  addEditReport() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request: AccountReport = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url =
        this.mode === 'insert'
          ? AccountReport.apiAddress + 'CreateAccountReport'
          : AccountReport.apiAddress + 'UpdateAccountReport';
      this.isLoadingSubmit = true;

      this.httpService
        .post<AccountReport>(url, request)
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

  getPeriodTypeList() {
    this.httpService
      // .get<any[]>(Period.apiAddress + 'ListDropDown')
      .get<any[]>(PeriodBudgetType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodTypeList = response.data.result;
        }
      });
  }

  getReportTypeCodeList() {
    this.httpService
      .get<any[]>(ReportItemType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.reportTypeCodeList = response.data.result;
        }
      });
  }

  getReportTitleTypeList() {
    this.httpService
      .get<any[]>(AccountReportType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.reportTitleTypesList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(AccountReport.apiAddress + 'GetAccountReportById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
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
}
