import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  FinancialRatiosIndustry,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-financial-ratios-industry',
  templateUrl: './add-edit-financial-ratios-industry.component.html',
  styleUrls: ['./add-edit-financial-ratios-industry.component.scss'],
})
export class AddEditFinancialRatiosIndustryComponent {
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  financialRatioList: any = [];
  industryList: any = [];
  inputData = new FinancialRatiosIndustry();
  @Input() mode = '';
  @Input() set data1(data: FinancialRatiosIndustry) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    debugger;
    this.getFinancialRatioLst();
    this.getIndustryLst();
    this.addEditForm = new FormGroup({
      financialRatioId: new FormControl(),
      industryId: new FormControl(null),
      periodId: new FormControl(null),
      price: new FormControl(null),
      code: new FormControl('02'),
      // meetingDate: new FormControl(),
    });
    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
    if (this.mode === 'insert' || this.mode === 'edit') {
      this.route.params.subscribe((param: any) => {
        if (param.id) {
          this.addEditForm.patchValue({
            periodId: param.id,
          });
        }
      });
    }
  }

  getFinancialRatioLst() {
    this.httpService
      .post<FinancialRatiosIndustry[]>(
        FinancialRatiosIndustry.apiAddressFinancialRatio,
        { withOutPagination: true }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.financialRatioList = response.data.result;
        }
      });
  }

  getIndustryLst() {
    this.httpService
      .get<FinancialRatiosIndustry[]>(
        FinancialRatiosIndustry.apiAddressIndustryLst
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.industryList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    debugger;
    this.httpService
      .get<any>(FinancialRatiosIndustry.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
  addEditFinancialRatiosIndustry() {
    this.addEditFormSubmitted = true;
    debugger;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = FinancialRatiosIndustry.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<FinancialRatiosIndustry>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'FinancialRatiosIndustry',
              life: 8000,
              severity: 'success',
              detail: ` عنوان  ${this.inputData.title}`,
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
}
