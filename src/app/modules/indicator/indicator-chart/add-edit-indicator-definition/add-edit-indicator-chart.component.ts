import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { Indicator } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-indicator-chart',
  templateUrl: './add-edit-indicator-chart.component.html',
  styleUrls: ['./add-edit-indicator-chart.component.scss'],
})
export class AddEditIndicatorChartComponent {
  public datePipe = new DatePipe('en-US');

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  groupTypeCodeList: any = [];

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
  get accountReportItemId() {
    return this.addEditForm.get('accountReportItemId');
  }


  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.getGroupTypeCodeList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      groupTypeCode: new FormControl(null),

    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
  }

  getGroupTypeCodeList() {
    // this.httpService
    //   .get<Indicator[]>(Indicator + 'list')
    //   .subscribe(response => {
    //     if (response.data && response.data.result) {
    //       this.groupTypeCodeList = response.data.result;
    //     }
    //   });
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
