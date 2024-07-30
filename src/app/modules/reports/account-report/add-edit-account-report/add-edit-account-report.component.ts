import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountReport, Period, PeriodBudgetType, ReportItemType } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-add-edit-account-report',
  templateUrl: './add-edit-account-report.component.html',
  styleUrls: ['./add-edit-account-report.component.scss']
})
export class AddEditAccountReportComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  periodTypeList: any = [];
  reportTypeCodeList: any = [];



  inputData = new AccountReport();
  @Input() mode = '';
  @Input() set data(data: AccountReport) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get title() {
    return this.addEditForm.get('title');
  }
  get code() {
    return this.addEditForm.get('code');
  }
  get periodTypeCode() {
    return this.addEditForm.get('periodTypeCode');
  }
  get reportTypeCode() {
    return this.addEditForm.get('reportTypeCode');
  }



  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.getPeriodTypeList();
    this.getReportTypeCodeList();


    this.addEditForm = new FormGroup({
      title: new FormControl(this.inputData.title, Validators.required),
      code: new FormControl(this.inputData.code, Validators.required),
      periodTypeCode: new FormControl('', Validators.required),
      reportTypeCode: new FormControl('', Validators.required)
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
      const url = this.mode === 'insert' ? AccountReport.apiAddress + 'CreateAccountReport' :
        AccountReport.apiAddress + 'UpdateAccountReport';
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


}
