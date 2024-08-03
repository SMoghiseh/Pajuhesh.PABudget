import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractNo, Period, ProductGroup, Sale } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { pairwise, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-sale',
  templateUrl: './add-edit-sale.component.html',
  styleUrls: ['./add-edit-sale.component.scss'],
})
export class AddEditSaleComponent implements OnInit {
  // form property
  addEditSaleForm: FormGroup = new FormGroup({});
  addEditSaleSubmitted = false;
  visibleconditionally = false;
  isLoadingSubmit = false;

  // dropdown data list
  budgetPeriodList: any = [];
  budgetPeriodDetailList: any = [];
  productGroupList: any = [];
  saleTypeList: any = [];
  contractList: any = [];
  inputData = new Sale();

  @Input() mode = '';
  @Input() set data1(data: Sale) {
    this.inputData = data;
  }
  isContractValue = false;
  isChangeSaleType = false;

  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();
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
  get costingUnitCu() {
    return this.addEditSaleForm.get('costingUnitCu');
  }
  get saleType() {
    return this.addEditSaleForm.get('saleType');
  }
  get contractId() {
    return this.addEditSaleForm.get('contractId');
  }
  get costingAllCu() {
    return this.addEditSaleForm.get('costingAllCu');
  }
  get benefitLossCu() {
    return this.addEditSaleForm.get('benefitLossCu');
  }
  get productAllSalesCu() {
    return this.addEditSaleForm.get('productAllSalesCu');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getPeriodLst();
    this.getProductGroupLst();
    this.getAllSaleTypeLst();
    this.getContractList();
    this.addEditSaleForm = new FormGroup({
      budgetPeriodId: new FormControl(
        this.inputData.budgetPeriodId
      ),
      budgetPeriodDetailId: new FormControl(
        this.inputData.budgetPeriodDetailId
      ),
      contractId: new FormControl(this.inputData.contractId),
      saleType: new FormControl(this.inputData.saleType),
      productGroupId: new FormControl(
        this.inputData.productGroupId
      ),
      productNumber: new FormControl(
        this.inputData.productNumber
      ),
      productUnitSalesCu: new FormControl(
        this.inputData.productUnitSalesCu
      ),
      productAllSalesCu: new FormControl(this.inputData.productAllSalesCu),
      benefitLossCu: new FormControl(this.inputData.benefitLossCu),
      costingAllCu: new FormControl(this.inputData.costingAllCu),
      costingUnitCu: new FormControl(this.inputData.costingUnitCu),
    });

    if (this.mode === 'edit') {
      this.addEditSaleForm.patchValue(this.inputData);
      this.getPeriodDetailLst(this.inputData.budgetPeriodId);
    }

    this.calculationOnFields();
  }

  addEditSale() {
    this.addEditSaleSubmitted = true;
    if (this.addEditSaleForm.valid) {
      let request = this.addEditSaleForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      request.saleType = request.saleType.id;
      const url =
        this.mode === 'insert'
          ? Sale.apiAddress + 'CreateSale'
          : Sale.apiAddress + 'UpdateSale';
      this.isLoadingSubmit = true;

      Object.entries(request).forEach(([key, val]) => {
        if (!val) request[key] = 0;
      });

      this.httpService
        .post<Sale>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'sale',
              life: 8000,
              severity: 'success',
              detail: ` نوع فروش`,
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
  getRowData(id: number) {
    this.httpService
      .get<any>(Sale.apiAddress + 'GetSaleById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditSaleForm.patchValue(response.data.result);


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

  getAllSaleTypeLst() {
    this.httpService
      .get<Sale[]>(Sale.typesApiAddress + 'GetAllSaleTypes')
      .subscribe(response => {
        if (response.data) {
          this.saleTypeList = response.data;
          if (this.mode == 'edit') {
            this.addEditSaleForm.patchValue({
              saleType: this.saleTypeList.find((i: any) => i.id === this.inputData['saleType'])
            });
            this.onChangeSaleType();
          }
        }
      });
  }
  getContractList() {
    this.httpService
      .post<ContractNo[]>(ContractNo.adiAddressList, { withOutPagination: false })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.contractList = response.data.result;
        }
      });
  }
  closeModal() {
    this.isCloseModal.emit(false);
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

  onChangeSaleType() {
    this.isChangeSaleType = true;
    this.isContractValue = this.addEditSaleForm.value.saleType.isContract;

    if (this.mode != 'edit') {
      let value = this.addEditSaleForm.controls['saleType'].value;
      this.addEditSaleForm.reset();
      this.addEditSaleForm.patchValue({
        saleType: value
      })
    }
  }

  calculationOnFields() {
    // تغییر فیلد تعداد 
    this.addEditSaleForm.controls['productNumber']
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        // محاسبه مبلغ کل فروش
        if (!this.isContractValue) {
          let value1 = next *
            this.addEditSaleForm.controls['productUnitSalesCu'].value
          this.addEditSaleForm.controls['productAllSalesCu'].setValue(value1);
        }
      });

    // تغییر فیلد مبلغ واحد فروش
    this.addEditSaleForm.controls['productUnitSalesCu']
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        // محاسبه مبلغ کل فروش
        if (!this.isContractValue) {
          let value1 = this.addEditSaleForm.controls['productNumber'].value *
            next;
          this.addEditSaleForm.controls['productAllSalesCu'].setValue(value1);
        }
      });

    // تغییر فیلد مبلغ کل فروش
    this.addEditSaleForm.controls['productAllSalesCu']
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        // محاسبه مبلغ  سود و زیان
        if (!this.isContractValue) {
          let value2 = next -
            this.addEditSaleForm.controls['costingAllCu'].value;
          this.addEditSaleForm.controls['benefitLossCu'].setValue(value2);
        }
      });
    // تغییر فیلد  بهای تمام شده 
    this.addEditSaleForm.controls['costingAllCu']
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        // محاسبه مبلغ  سود و زیان
        if (!this.isContractValue) {
          let value2 = this.addEditSaleForm.controls['productAllSalesCu'].value -
            next;
          this.addEditSaleForm.controls['benefitLossCu'].setValue(value2);
        }
        if (this.isContractValue) {
          let value2 = this.addEditSaleForm.controls['costingUnitCu'].value -
            next;
          this.addEditSaleForm.controls['benefitLossCu'].setValue(value2);
        }
      });
    // تغییر فیلد  مبلغ قرارداد 
    this.addEditSaleForm.controls['costingUnitCu']
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        // محاسبه مبلغ  سود و زیان
        if (!this.isContractValue) {
          let value2 = this.addEditSaleForm.controls['productAllSalesCu'].value -
            next;
          this.addEditSaleForm.controls['benefitLossCu'].setValue(value2);
        }
        if (this.isContractValue) {
          let value2 = next -
            this.addEditSaleForm.controls['costingAllCu'].value;
          this.addEditSaleForm.controls['benefitLossCu'].setValue(value2);
        }
      });

  }
}
