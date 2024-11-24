import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BudgetPeriod, RelatedActivity } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-year-activity-break',
  templateUrl: './add-edit-year-activity-break.component.html',
  styleUrls: ['./add-edit-year-activity-break.component.scss']
})
export class AddEditYearActivityBreakComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  yearActivityList: any = [];
  relatedYearActivityList: any = [];
  relationTypeList: any = [];


  inputData = new BudgetPeriod();
  @Input() mode = '';
  @Input() set data1(data: BudgetPeriod) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get reportPrice() {
    return this.addEditForm.get('reportPrice');
  }

  get reportPercent() {
    return this.addEditForm.get('reportPercent');
  }

  get description() {
    return this.addEditForm.get('description');
  }



  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.addEditForm = new FormGroup({
      yearActivityTitle: new FormControl(''),
      fromFiscalPeriodTitle: new FormControl(''),
      toFiscalPeriodTitle: new FormControl(''),
      budgetPrice: new FormControl(''),
      budgetPercent: new FormControl(''),
      reportPrice: new FormControl(''),
      reportPercent: new FormControl(''),
      description: new FormControl(''),

    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

  }

  addEditBudget() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      let data = {
        id: this.inputData.id,
        description: request.description,
        reportPrice: request.reportPrice,
        reportPercent: request.reportPercent
      }
      const url = BudgetPeriod.apiAddress + 'ProgramBreak/' + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<RelatedActivity>(url, data)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'RelatedActivity',
              life: 8000,
              severity: 'success',
              detail: ` عنوان  ${request.yearActivityTitle}`,
              summary: this.mode === 'insert'
                ? 'با موفقیت درج شد'
                : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }


  getRowData(id: number) {
    this.httpService
      .get<any>(BudgetPeriod.apiAddress + 'ProgramBreak/' + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }

  onlyFloatNumberKey(event: { charCode: number }) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46;
  }

}
