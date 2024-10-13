import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  FinancialRatiosPrice,
  UrlBuilder,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-financial-ratios-price',
  templateUrl: './add-edit-financial-ratios-price.component.html',
  styleUrls: ['./add-edit-financial-ratios-price.component.scss'],
})
export class AddEditFinancialRatiosPriceComponent {
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  MeetingTopicList: any = [];
  unitList: any = [];
  companyList: any = [];
  financialRatioList: any = [];
  inputData = new FinancialRatiosPrice();
  @Input() mode = '';
  @Input() set data1(data: FinancialRatiosPrice) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getFinancialRatioLst();
    this.getCompanyLst();
    this.getUnitLst();
    this.addEditForm = new FormGroup({
      financialRatioId: new FormControl(),
      companyId: new FormControl(null),
      periodId: new FormControl(null),
      price: new FormControl(null),
      code: new FormControl(),
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

  getRowData(id: number) {
    this.httpService
      .get<any>(FinancialRatiosPrice.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
  addEditFinancialRatiosPrice() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = FinancialRatiosPrice.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<any>(UrlBuilder.build(url, ''), request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'FinancialRatiosPrice',
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
  getFinancialRatioLst() {
    this.httpService
      .post<FinancialRatiosPrice[]>(
        FinancialRatiosPrice.apiAddressFinancialRatio,
        {
          withOutPagination: true,
        }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.financialRatioList = response.data.result;
        }
      });
  }

  getUnitLst() {
    this.httpService
      .post<FinancialRatiosPrice[]>(FinancialRatiosPrice.apiAddressAllUnits, {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.unitList = response.data.result;
        }
      });
  }
  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
}
