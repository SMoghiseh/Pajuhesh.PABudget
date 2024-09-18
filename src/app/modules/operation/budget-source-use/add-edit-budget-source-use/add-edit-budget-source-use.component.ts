import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  BudgetSourceUse,
  Company,
  Period,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-budget-source-use',
  templateUrl: './add-edit-budget-source-use.component.html',
  styleUrls: ['./add-edit-budget-source-use.component.scss'],
})
export class AddEditBudgetSourceUseComponent implements OnInit {
  addEditBudgetSourceUseForm!: FormGroup;
  public datePipe = new DatePipe('en-US');
  inputData = new BudgetSourceUse();
  inputDataDetails = new BudgetSourceUse();
  addEditBudgetSourceUseModel = new BudgetSourceUse();
  isLoadingSubmit = false;
  addEditBudgetSourceUseSubmitted = false;
  periodDetailLst: Period[] = [];
  sourceUseDetailLst: BudgetSourceUse[] = [];
  periodLst: Period[] = [];
  companyList: any = [];
  sourceUseTypeList: BudgetSourceUse[] = [];

  @Input()
  set data(data: BudgetSourceUse) {
    this.inputData = data;
  }
  @Output() isCloseModal = new EventEmitter<boolean>();
  // @Input()
  // set dataDetaild(dataDetaild: BudgetSourceUse) {
  //   this.inputDataDetails = dataDetaild;
  // }
  @Output() isSuccess = new EventEmitter<boolean>();
  get budgetPeriodId() {
    return this.addEditBudgetSourceUseForm.get('budgetPeriodId');
  }
  get budgetPeriodDetailId() {
    return this.addEditBudgetSourceUseForm.get('budgetPeriodDetailId');
  }
  get companyId() {
    return this.addEditBudgetSourceUseForm.get('companyId');
  }

  get sourceUseTypeId() {
    return this.addEditBudgetSourceUseForm.get('sourceUseTypeId');
  }
  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCompanyLst();
    this.getResourceUseType();
    this.addEditBudgetSourceUseForm = new FormGroup({
      budgetPeriodId: new FormControl(
        this.addEditBudgetSourceUseModel.budgetPeriodId,
        Validators.required
      ),
      budgetPeriodDetailId: new FormControl(
        this.addEditBudgetSourceUseModel.budgetPeriodDetailId,
        Validators.required
      ),
      companyId: new FormControl(
        this.addEditBudgetSourceUseModel.companyId,
        Validators.required
      ),
      sourceUseTypeId: new FormControl(
        this.addEditBudgetSourceUseModel.sourceUseTypeId
      ),
      budgetPriceCu: new FormControl(
        this.addEditBudgetSourceUseModel.budgetPriceCu
      ),
      realPriceCu: new FormControl(
        this.addEditBudgetSourceUseModel.realPriceCu
      ),
    });

    if (this.inputData.type === 'edit') {
      this.getPeriodDetailLst(this.inputData.budgetPeriodId);
      this.addEditBudgetSourceUseForm.patchValue(this.inputData);
    }
  }
  addEditBudgetSourceUse() {
    if (this.addEditBudgetSourceUseForm.valid) {
      this.isLoadingSubmit = true;
      const {
        id,
        budgetPeriodId,
        budgetPeriodDetailId,
        companyId,
        sourceUseTypeId,
        budgetPriceCu,
        realPriceCu,
      } = this.addEditBudgetSourceUseForm.value;
      // const { id } = this.addEditBudgetSourceUseForm.value;
      const request: BudgetSourceUse = this.addEditBudgetSourceUseForm.value;
      request.id = this.inputData.type === 'insert' ? 0 : this.inputData.id;
      request.budgetPeriodId = budgetPeriodId;
      request.budgetPeriodDetailId = budgetPeriodDetailId;
      request.companyId = companyId;
      request.sourceUseTypeId = sourceUseTypeId;
      request.budgetPriceCu = budgetPriceCu;
      request.realPriceCu = realPriceCu;
      this.httpService
        .post<BudgetSourceUse>(BudgetSourceUse.apiAddress, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'BudgetSourceUse',
              life: 8000,
              severity: 'success',
              detail: `منابع و مصارف`,
              summary:
                this.inputData.type === 'insert'
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

  onChangeResourceUse(e: any) {
    this.getPeriodDetailLst(e.value);
  }
  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodLst = response.data.result;
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

  getResourceUseType() {
    this.httpService
      .get<BudgetSourceUse[]>(BudgetSourceUse.apiAdressResourceUse)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.sourceUseTypeList = response.data.result;
        }
      });
  }
  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailLst = response.data.result;
          if (this.inputData.id)
            this.addEditBudgetSourceUseForm.patchValue({
              budgetPeriodDetailId: this.inputData.budgetPeriodDetailId,
            });
        }
      });
  }
}
