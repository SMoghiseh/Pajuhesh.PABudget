import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Period, ProductGroup, Sale } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-sale',
  templateUrl: './add-edit-sale.component.html',
  styleUrls: ['./add-edit-sale.component.scss'],
})
export class AddEditSaleComponent implements OnInit {
  // form property
  addEditSaleForm!: FormGroup;
  addEditSaleSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  budgetPeriodList: any = [];
  budgetPeriodDetailList: any = [];
  productGroupList: any = [];
  saleTypeList: any = [
    { id: 0, title: 'بازرگانی' },
    { id: 1, title: 'تولیدی' },
    { id: 2, title: 'پیمانکاری' },
  ];

  inputData = new Sale();
  mode = '';

  @Input()
  set data1(data: Sale) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get budgetPeriodId() {
    return this.addEditSaleForm.get('budgetPeriodId');
  }
  get budgetPeriodDetailId() {
    return this.addEditSaleForm.get('budgetPeriodDetailId');
  }
  get productUnitSalesCu() {
    return this.addEditSaleForm.get('productUnitSalesCu');
  }
  get productGroupId() {
    return this.addEditSaleForm.get('productGroupId');
  }
  get productNumber() {
    return this.addEditSaleForm.get('productNumber');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPeriodLst();
    this.getProductGroupLst();

    this.addEditSaleForm = new FormGroup({
      budgetPeriodId: new FormControl('', Validators.required),
      budgetPeriodDetailId: new FormControl('', Validators.required),
      contractId: new FormControl(''),
      saleType: new FormControl(''),
      productGroupId: new FormControl('', Validators.required),
      productNumber: new FormControl('', Validators.required),
      productUnitSalesCu: new FormControl('', Validators.required),
      productAllSalesCu: new FormControl(''),
      benefitLossCu: new FormControl(''),
      costingAllCu: new FormControl(''),
      costingUnitCu: new FormControl(''),
    });

    // if (this.mode === 'edit') {
    //   this.getPeriodDetailLst(this.inputData.id);
    //   this.addEditSaleForm.patchValue(this.inputData);
    // }
  }

  addEditSale() {
    this.addEditSaleSubmitted = true;
    if (this.addEditSaleForm.valid) {
      const request: Sale = this.addEditSaleForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      this.isLoadingSubmit = true;

      this.httpService
        .post<Sale>(Sale.apiAddress + 'CreateSale', request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'companyDefinition',
              life: 8000,
              severity: 'success',
              detail: `بودجه پرسنل`,
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

  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
  }
  getProductGroupLst() {
    this.httpService
      .get<ProductGroup[]>(ProductGroup.getListApiAddress)
      .subscribe(response => {
        if (response.data) {
          this.productGroupList = response.data;
        }
      });
  }
  onChangePeriod(e: any) {
    this.getPeriodDetailLst(e.value);
  }
  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodDetailList = response.data.result;
          if (this.inputData.id)
            this.addEditSaleForm.patchValue({
              budgetPeriodDetailId: this.inputData.budgetPeriodDetailId,
            });
        }
      });
  }
}
