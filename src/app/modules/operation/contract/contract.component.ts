import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Contract,
  ContractNo,
  ContractType,
  Employers,
  Pagination
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [ConfirmationService],
})
export class ContractComponent implements OnInit {
  modalTitle = '';
  isOpenAddEditContractlNo = false;
  addEditData = new ContractNo();
  editDataDetails: Contract[] = [];
  pId!: string;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: ContractNo[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  public datePipe = new DatePipe('en-US');

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  contracTypeLst: ContractType[] = [];
  employerLst: Employers[] = [];
  contractorLst: Employers[] = [];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private jDateCalculatorService: JDateCalculatorService

  ) { }

  ngOnInit(): void {
    this.getContracType();
    this.getEmployer();
    this.getContractor();
    this.searchForm = new FormGroup({
      contractDate: new FormControl(null),
      contractFromDate: new FormControl(null),
      contractToDate: new FormControl(null),
      employerID: new FormControl(0),
      contractorID: new FormControl(0),
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
  addContractlNo() {
    this.modalTitle = 'افزودن قرارداد جدید';
    this.isOpenAddEditContractlNo = true;
    this.addEditData.type = 'insert';
  }
  getContractlNo(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.searchForm.value;
    formValue.contractDate = formValue.contractDate
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          formValue.contractDate?.getFullYear(),
          formValue.contractDate?.getMonth(),
          formValue.contractDate?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;
    formValue.contractFromDate = formValue.contractFromDate
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          formValue.contractFromDate?.getFullYear(),
          formValue.contractFromDate?.getMonth(),
          formValue.contractFromDate?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;
    formValue.contractToDate = formValue.contractToDate
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          formValue.contractToDate?.getFullYear(),
          formValue.contractToDate?.getMonth(),
          formValue.contractToDate?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;



    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;


    const searchModel = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      ...formValue
    };

    this.loading = true;
    this.first = 0;

    const url = ContractNo.adiAddressList;
    this.httpService
      .post<ContractNo[]>(url, searchModel)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new ContractNo()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  reloadData() {
    this.isOpenAddEditContractlNo = false;
    this.getContractlNo();
  }

  closeModal() {
    this.isOpenAddEditContractlNo = false;
  }

  deleteRow(contractNo: ContractNo) {
    if (contractNo && contractNo.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${contractNo.id} " اطمینان دارید؟`,
        header: `قرارداد ${contractNo.id}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteContractNo(contractNo.id),
      });
  }
  deleteContractNo(id: number) {
    if (id) {
      this.httpService
        .post<ContractNo[]>(`${Contract.apiAddressDel}/${id}`, {})

        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'contractNo',
              life: 8000,
              severity: 'success',
              detail: `کد قرارداد ${id}`,
              summary: 'با موفقیت حذف شد',
            });

            this.getContractlNo();
          }
        });
    }
  }

  editRow(data: ContractNo) {
    this.modalTitle = '  ویرایش کد قرارداد ' + '"' + data.contractCode + '"';
    this.addEditData = data;
    this.addEditData.type = 'edit';
    this.isOpenAddEditContractlNo = true;
  }

  clearSearch() {
    this.searchForm.reset();
    this.getContractlNo();
  }

}
