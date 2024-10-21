import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FiscalYear, Period } from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { JDate } from '@shared/utilities/JDate/jdate';

@Component({
  selector: 'app-add-edit-period',
  templateUrl: './add-edit-period.component.html',
  styleUrls: ['./add-edit-period.component.scss'],
})
export class AddEditPeriodComponent implements OnInit {
  public datePipe = new DatePipe('en-US');
  addEditPeriodForm!: FormGroup;
  addEditPeriodSubmitted = false;
  addNewCompanyModel = new Period();
  inputData = new Period();
  isLoadingSubmit = false;
  fiscalYearList: any = [];

  @Input()
  set data(data: Period) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get code() {
    return this.addEditPeriodForm.get('code');
  }
  get title() {
    return this.addEditPeriodForm.get('title');
  }
  get fromDate() {
    return this.addEditPeriodForm.get('fromDate');
  }
  get toDate() {
    return this.addEditPeriodForm.get('toDate');
  }
  get startFiscalYearId() {
    return this.addEditPeriodForm.get('startFiscalYearId');
  }

  constructor(
    private jDateCalculatorService: JDateCalculatorService,
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getFiscalYearLst();

    this.addEditPeriodForm = new FormGroup({
      code: new FormControl(this.addNewCompanyModel.code, Validators.required),
      title: new FormControl(
        this.addNewCompanyModel.title,
        Validators.required
      ),
      fromDate: new FormControl(
        this.addNewCompanyModel.fromDate,
        Validators.required
      ),
      toDate: new FormControl(
        this.addNewCompanyModel.toDate,
        Validators.required
      ),
      startFiscalYearId: new FormControl(
        this.addNewCompanyModel.startFiscalYearId,
        Validators.required
      ),
    });
    if (this.inputData.type1 === 'edit') {
      this.addEditPeriodForm.patchValue(this.inputData);
      this.addEditPeriodForm.patchValue({
        fromDate: new JDate(new Date(this.inputData.fromDate)),
        toDate: new JDate(new Date(this.inputData.toDate)),
      });
    }
  }

  getFiscalYearLst() {
    this.httpService
      .get<FiscalYear[]>(
        FiscalYear.apiAddress + 'List'
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.fiscalYearList = response.data.result;
        }
      });
  }

  addEditPeriod() {
    this.addEditPeriodSubmitted = true;
    if (this.addEditPeriodForm.valid) {
      const request: Period = this.addEditPeriodForm.value;
      request.id = this.inputData.type1 === 'insert' ? 0 : this.inputData.id;
      if (this.inputData.type2 === 'detail')
        request.periodId = this.inputData.periodId;
      request.fromDate = request.fromDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.fromDate?.getFullYear(),
            request.fromDate?.getMonth(),
            request.fromDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.toDate = request.toDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.toDate?.getFullYear(),
            request.toDate?.getMonth(),
            request.toDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;

      this.isLoadingSubmit = true;
      const url =
        this.inputData.type2 === 'master'
          ? Period.apiAddress
          : Period.apiAddressDetail;

      this.httpService
        .post<Period>(url + 'Create', request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'periodDefinition',
              life: 8000,
              severity: 'success',
              detail:
                this.inputData.type2 === 'master'
                  ? `دوره بودجه`
                  : `دوره عملیاتی`,
              summary:
                this.inputData.type1 === 'insert'
                  ? 'با موفقیت درج شد'
                  : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }
}
