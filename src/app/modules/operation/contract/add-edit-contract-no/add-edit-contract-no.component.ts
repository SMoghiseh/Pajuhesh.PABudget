import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Contract,
  ContractNo,
  ContractType,
  Employers,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-contract-no',
  templateUrl: './add-edit-contract-no.component.html',
  styleUrls: ['./add-edit-contract-no.component.scss'],
})
export class AddEditContractNoComponent implements OnInit {
  addEditContractNoForm!: FormGroup;
  public datePipe = new DatePipe('en-US');
  inputData = new ContractNo();
  addEditContractNoModel = new ContractNo();
  isLoadingSubmit = false;
  contracTypeLst: ContractType[] = [];
  employerLst: Employers[] = [];
  contractorLst: Employers[] = [];
  selectedContract: Contract[] = [];

  @Input()
  set data(data: ContractNo) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) {}

  ngOnInit(): void {
    this.getContracType();
    this.getEmployer();
    this.getContractor();
    this.addEditContractNoForm = new FormGroup({
      contractCode: new FormControl(this.addEditContractNoModel.contractCode),
      contractDate: new FormControl(this.addEditContractNoModel.contractDate),
      contractFromDate: new FormControl(
        this.addEditContractNoModel.contractFromDate
      ),
      contractToDate: new FormControl(
        this.addEditContractNoModel.contractToDate
      ),
      contracTypeID: new FormControl(this.addEditContractNoModel.contracTypeID),
      employerID: new FormControl(this.addEditContractNoModel.employerID),
      contractorID: new FormControl(this.addEditContractNoModel.contractorID),
      contractPriceCu: new FormControl(
        this.addEditContractNoModel.contractPriceCu
      ),
    });
    if (this.inputData.type === 'edit') {
      debugger;

      this.addEditContractNoForm.patchValue(this.inputData);
    }
  }

  getContracType() {
    this.httpService
      .get<ContractType[]>(ContractType.apiAddress + '/list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.contracTypeLst = response.data.result;
        }
      });
  }

  getEmployer() {
    this.httpService
      .get<Employers[]>(Employers.apiAddress)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.employerLst = response.data.result;
        }
      });
  }

  getContractor() {
    this.httpService
      .get<Employers[]>(Employers.apiAddress)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.contractorLst = response.data.result;
        }
      });
  }

  addEditContractNo() {
    debugger;
    if (this.addEditContractNoForm.valid) {
      this.isLoadingSubmit = true;
      const {
        contractCode,
        contractDate,
        contractFromDate,
        contractToDate,
        contracTypeID,
        employerID,
        contractorID,
        contractPriceCu,
      } = this.addEditContractNoForm.value;
      const request: ContractNo = this.addEditContractNoForm.value;
      request.id = this.inputData.type === 'insert' ? 0 : this.inputData.id;
      request.contracTypeID = contracTypeID;
      request.contractCode = contractCode;
      request.contractDate = request.contractDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              contractDate?.getFullYear(),
              contractDate?.getMonth(),
              contractDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;
      request.contractFromDate = request.contractFromDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              contractFromDate?.getFullYear(),
              contractFromDate?.getMonth(),
              contractFromDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;
      request.contractToDate = request.contractToDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              contractToDate?.getFullYear(),
              contractToDate?.getMonth(),
              contractToDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;
      request.employerID = employerID;
      request.contractorID = contractorID;
      request.contractPriceCu = contractPriceCu;
      this.httpService
        .post<ContractNo>(ContractNo.apiAddress, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'contractNo',
              life: 8000,
              severity: 'success',
              detail: `قرارداد`,
              summary: 'با موفقیت درج شد',
            });

            this.isSuccess.emit(true);
          }
        });
    }
  }
}
