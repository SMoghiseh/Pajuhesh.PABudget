import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { Contract, ContractType } from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'app-add-edit-contract',
  templateUrl: './add-edit-contract.component.html',
  styleUrls: ['./add-edit-contract.component.scss'],
})
export class AddEditContractComponent {
  formHeader = '';
  buttonLabel = '';
  addNewCompanyLoading = false;
  addNewContractSubmitted = false;
  public datePipe = new DatePipe('en-US');
  addNewContractForm!: FormGroup;
  contractTypes: ContractType[] = [];
  get contractCode() {
    return this.addNewContractForm.get('contractCode');
  }
  get contractDate() {
    return this.addNewContractForm.get('contractDate');
  }
  get contractFromDate() {
    return this.addNewContractForm.get('contractFromDate');
  }
  get contractToDate() {
    return this.addNewContractForm.get('contractToDate');
  }
  get contracTypeID() {
    return this.addNewContractForm.get('contracTypeID');
  }
  get employerID() {
    return this.addNewContractForm.get('employerID');
  }
  get contractorID() {
    return this.addNewContractForm.get('contractorID');
  }
  get contractPriceCu() {
    return this.addNewContractForm.get('contractPriceCu');
  }

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private jDateCalculatorService: JDateCalculatorService,
    private messageService: MessageService
  ) {
    this.addNewContractForm = new FormGroup({
      contractCode: new FormControl(),
      contractDate: new FormControl(),
      contractFromDate: new FormControl(),
      contractToDate: new FormControl(),
      contracTypeID: new FormControl(),
      employerID: new FormControl(),
      contractorID: new FormControl(),
      contractPriceCu: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.setComponentMode();
    this.getContractTypes();
  }

  setComponentMode() {
    this.formHeader = 'افزودن قرارداد';
    this.buttonLabel = 'افزودن';
  }

  getContractTypes() {
    this.httpService
      .get<ContractType[]>(`${ContractType.apiAddress}/` + 'list')
      .subscribe(responce => {
        if (responce.data.result) {
          this.contractTypes = responce.data.result;
        }
      });
  }

  addNewContract() {
    debugger;
    this.addNewContractSubmitted = true;
    if (this.addNewContractForm.valid) {
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
      } = this.addNewContractForm.value;

      const request = new Contract();
      request.id = id;
      request.contractCode = contractCode;
      request.contracTypeID = contracTypeID;
      request.employerID = employerID;
      request.contractorID = contractorID;
      request.contractPriceCu = contractPriceCu;

      request.contractDate = contractDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              contractDate?.getFullYear(),
              contractDate?.getMonth(),
              contractDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;

      request.contractFromDate = contractFromDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              contractFromDate?.getFullYear(),
              contractFromDate?.getMonth(),
              contractFromDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;
      request.contractToDate = contractToDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              contractToDate?.getFullYear(),
              contractToDate?.getMonth(),
              contractToDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;

      this.addNewCompanyLoading = true;

      this.httpService
        .post<Contract>((Contract.apiAddress, 'CreateContract'), request)
        .pipe(tap(() => (this.addNewCompanyLoading = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'contractDefinition',
              life: 8000,
              severity: 'success',
              detail: `اطلاعات شرکت`,
              summary: 'با موفقیت درج شد',
            });
          }
        });
    }
  }
  addNewsharedHolders() {}
}
