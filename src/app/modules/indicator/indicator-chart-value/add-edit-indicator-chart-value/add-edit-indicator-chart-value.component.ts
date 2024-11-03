import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { Indicator } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-indicator-chart-value',
  templateUrl: './add-edit-indicator-chart-value.component.html',
  styleUrls: ['./add-edit-indicator-chart-value.component.scss'],
})
export class AddEditIndicatorChartValueComponent {
  public datePipe = new DatePipe('en-US');

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  indicatorChartsList: any = [];

  inputData = new Indicator();
  @Input() mode = '';
  @Input() set data(data: Indicator) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();


  get title() {
    return this.addEditForm.get('title');
  }
  get indicatorChartId() {
    return this.addEditForm.get('indicatorChartId');
  }


  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.GetAllIndicatorCharts();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      indicatorChartId: new FormControl(null),

    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
  }

  GetAllIndicatorCharts() {
    this.httpService
      .post<Indicator[]>(Indicator.apiAddressIndicator + 'GetAllIndicatorCharts' , {
        "withOutPagination": true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.indicatorChartsList = response.data.result;
        }
      });
  }

  addEditIndicator() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;

      const url =
        this.mode === 'insert'
          ? Indicator.apiAddressIndicator + 'CreateIndicatorChartValue'
          : Indicator.apiAddressIndicator + 'UpdateIndicatorChartValue';
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


  closeModal() {
    this.isCloseModal.emit(false);
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(Indicator.apiAddressIndicator + 'GetIndicatorChartValueById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
