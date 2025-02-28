import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  Contract,
  ContractNo,
  ContractType,
  Employers,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';
import { MessageService } from 'primeng/api';
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
  inputDataDetails = new Contract();
  addEditContractNoModel = new ContractNo();
  isLoadingSubmit = false;
  addEditContractNoSubmitted = false;
  contracTypeLst: ContractType[] = [];
  employerLst: Employers[] = [];
  contractorLst: Employers[] = [];
  selectedContract: Contract[] = [];
  companyList: any = [];

  @Input()
  set data(data: ContractNo) {
    this.inputData = data;
  }
  @Input()
  set dataDetaild(dataDetaild: Contract) {
    this.inputDataDetails = dataDetaild;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();
  get contractCode() {
    return this.addEditContractNoForm.get('contractCode');
  }
  get contractDate() {
    return this.addEditContractNoForm.get('contractDate');
  }
  get contractFromDate() {
    return this.addEditContractNoForm.get('contractFromDate');
  }
  get contractToDate() {
    return this.addEditContractNoForm.get('contractToDate');
  }
  get contractorID() {
    return this.addEditContractNoForm.get('contractorID');
  }
  get employerID() {
    return this.addEditContractNoForm.get('employerID');
  }
  get contracTypeID() {
    return this.addEditContractNoForm.get('contracTypeID');
  }
  get companyId() {
    return this.addEditContractNoForm.get('companyId');
  }
  get contractPriceCu() {
    return this.addEditContractNoForm.get('contractPriceCu');
  }


  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) { }

  ngOnInit(): void {
    this.getContracType();
    this.getEmployer();
    this.getContractor();
    this.getCompanyLst();

    this.addEditContractNoForm = new FormGroup({
      contractCode: new FormControl(this.addEditContractNoModel.contractCode, Validators.required),
      contractDate: new FormControl(this.addEditContractNoModel.contractDate,
        Validators.required),
      contractFromDate: new FormControl(
        this.addEditContractNoModel.contractFromDate,
        Validators.required
      ),
      companyId: new FormControl(this.addEditContractNoModel.companyId,
        Validators.required),
      contractToDate: new FormControl(
        this.addEditContractNoModel.contractToDate,
        Validators.required
      ),
      contracTypeID: new FormControl(this.addEditContractNoModel.contracTypeID,
        Validators.required),
      employerID: new FormControl(this.addEditContractNoModel.employerID,
        Validators.required),
      contractorID: new FormControl(this.addEditContractNoModel.contractorID,
        Validators.required),
      contractPriceCu: new FormControl(
        this.addEditContractNoModel.contractPriceCu,
        Validators.required
      ),

    });

    if (this.inputData.id && this.inputData.type == 'edit') {
      this.getContractDetails(this.inputData.id);
    }
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

  getContractDetails(id: number) {
    this.httpService
      .get(Contract.apiAddress + id)
      .subscribe((response: any) => {
        if (response.data) {
          this.inputDataDetails = response.data?.result;
        }
        this.addEditContractNoForm.patchValue(this.inputDataDetails);
        this.addEditContractNoForm.patchValue({
          contractDate: new JDate(
            new Date(this.inputDataDetails.milContractDate)
          ),
          contractFromDate: new JDate(
            new Date(this.inputDataDetails.milContractFromDate)
          ),
          contractToDate: new JDate(
            new Date(this.inputDataDetails.milContractToDate)
          ),
        });
      });
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

  closeModal() {
    this.isCloseModal.emit(false);
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
    this.addEditContractNoSubmitted = true;
    if (this.addEditContractNoForm.valid) {
      this.isLoadingSubmit = true;
      const {
        id,
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
      request.id = this.inputData.type === 'insert' ? id : this.inputData.id;
      // if (this.inputData.type === 'edit')
      request.contracTypeID = contracTypeID;
      request.contractCode = contractCode;
      request.employerID = employerID;
      request.contractorID = contractorID;
      request.contractPriceCu = contractPriceCu;
      // request.contracTypeID = contracTypeID;
      // request.contractCode = contractCode;
      request.contractDate = contractDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.contractDate?.getFullYear(),
            request.contractDate?.getMonth(),
            request.contractDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.contractFromDate = contractFromDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.contractFromDate?.getFullYear(),
            request.contractFromDate?.getMonth(),
            request.contractFromDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.contractToDate = contractToDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.contractToDate?.getFullYear(),
            request.contractToDate?.getMonth(),
            request.contractToDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;

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
}
