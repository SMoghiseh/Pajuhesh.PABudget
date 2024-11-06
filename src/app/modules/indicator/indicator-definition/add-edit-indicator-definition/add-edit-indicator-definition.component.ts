import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  AccountReportItem,
  BudgetPeriod,
  Indicator,
  ReferenceList,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-indicator-definition',
  templateUrl: './add-edit-indicator-definition.component.html',
  styleUrls: ['./add-edit-indicator-definition.component.scss'],
})
export class AddEditIndicatorDefinitionComponent {
  public datePipe = new DatePipe('en-US');

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  disCombo = false;

  // dropdown data list
  periodTypeList: any = [];
  minMaxTypeCodeList: any = [];
  qualityTypeCodeList: any = [];
  indicatorTypeList: any = [];
  accountReportItemList: any = [];
  chartTypeList: any = [];

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
  // get chartTypeCode() {
  //   return this.addEditForm.get('chartTypeCode');
  // }
  get qualityTypeCode() {
    return this.addEditForm.get('qualityTypeCode');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getIndicatorTypeList();
    this.getMinMaxTypeCodeList();
    this.getQualityTypeCodeList();
    this.getPeriodTypeList();
    this.getAccountReportItemList();
    this.addEditForm = new FormGroup({
      // code: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      accountReportItemId: new FormControl(null),
      indicatorTypeCode: new FormControl(null, Validators.required),
      periodTypeCode: new FormControl(null),
      minMaxTypeCode: new FormControl(null),
      chartTypeCode: new FormControl(null),
      qualityTypeCode: new FormControl(null),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
  }

  addEditIndicator() {
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
  getAccountReportItemList() {
    this.httpService
      .post<BudgetPeriod[]>(BudgetPeriod.apiAddress, {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportItemList = response.data.result;
        }
      });
  }

  changeQualityTypeCode(e: any) {
    if (e.value === 30264) {
      this.disCombo = true;
      // this.getAccountReportItemList();
      this.getChartTypeList();
    } else this.disCombo = false;
  }
  getChartTypeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiAddressIndicator + 'GetRelatedTableItems')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.chartTypeList = response.data.result;
        }
      });
  }
  getMinMaxTypeCodeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiAddressMinMaxTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.minMaxTypeCodeList = response.data.result;
        }
      });
  }
  getQualityTypeCodeList() {
    this.httpService
      .get<Indicator[]>(Indicator.apiAddressQualityTypeCode + 'list', '')
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
