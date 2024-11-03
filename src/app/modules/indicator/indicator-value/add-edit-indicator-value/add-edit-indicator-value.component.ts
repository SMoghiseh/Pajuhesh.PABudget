import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { Company, Indicator, Period } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-indicator-value',
  templateUrl: './add-edit-indicator-value.component.html',
  styleUrls: ['./add-edit-indicator-value.component.scss'],
})
export class AddEditIndicatorValueComponent {
  public datePipe = new DatePipe('en-US');
  submitted = false;
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  getindicatorId: any;
  getPeriodId: any;
  // dropdown data list
  periodTypeList: any = [];
  minMaxTypeCodeList: any = [];
  qualityTypeCodeList: any = [];
  indicatorTypeList: any = [];
  chartValueList: any = [];
  companyList: any = [];
  periodList: any = [];
  inputData = new Indicator();
  @Input() mode = '';
  @Input() set data(data: Indicator) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();

  get code() {
    return this.addEditForm.get('code');
  }
  get title() {
    return this.addEditForm.get('title');
  }
  get accountReportItemId() {
    return this.addEditForm.get('accountReportItemId');
  }
  get periodTypeCode() {
    return this.addEditForm.get('periodTypeCode');
  }
  get minMaxTypeCode() {
    return this.addEditForm.get('minMaxTypeCode');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  // get chartTypeCode() {
  //   return this.addEditForm.get('chartTypeCode');
  // }
  get qualityTypeCode() {
    return this.addEditForm.get('qualityTypeCode');
  }

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getindicatorId = params['id'];
    });

    this.getPeriodList();
    this.getCompanyList();
    this.getQualityTypeCodeList();
    this.addEditForm = new FormGroup({
      chartValue: new FormControl(''),
      minValue: new FormControl(''),
      maxValue: new FormControl(null),
      fromPeriodDetailId: new FormControl(null),
      toPeriodDetailId: new FormControl(null),
      periodId: new FormControl(null),
      // chartTypeCode: new FormControl(null),
      indicatorId: new FormControl(null),
      qualityTypeCode: new FormControl(),
      companyId: new FormControl(null),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
  }

  getCompanyList() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getPeriodList() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodList = response.data.result;
        }
      });
  }

  onChangePeriod(e: any) {
    debugger;

    this.getChartValueList(e.value);
  }
  getChartValueList(periodId: number) {
    debugger;
    const body = {
      indicatorId: parseInt(this.getindicatorId),
      periodId: periodId,
    };

    this.httpService
      .post<Indicator[]>(Indicator.apiAddressChartvalue, body)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.chartValueList = response.data.result;
        }
      });
  }
  addEditIndicatorValue() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;

      const url =
        this.mode === 'insert'
          ? Indicator.apiAddressIndicator + 'CreateIndicator'
          : Indicator.apiAddressIndicator + 'UpdateIndicator';
      this.isLoadingSubmit = true;

      this.httpService
        .post<Indicator>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: ' Indicator',
              life: 8000,
              severity: 'success',
              detail: ` برنامه  ${request.title}`,
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
      .get<Indicator[]>(Indicator.apiaddressPeriodTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodTypeList = response.data.result;
        }
      });
  }

  getQualityTypeCodeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiAddressQualityTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.qualityTypeCodeList = response.data.result;
        }
      });
  }
  getIndicatorTypeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiaddressIndicatorType + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.indicatorTypeList = response.data.result;
        }
      });
  }

  closeModal() {
    this.isCloseModal.emit(false);
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(Indicator.apiAddressIndicator + 'GetIndicatorById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
