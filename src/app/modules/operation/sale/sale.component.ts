import { Component, OnInit } from '@angular/core';
import { Company, ContractNo, Pagination, Period, ProductGroup, Sale, UrlBuilder } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  providers: [ConfirmationService],
})
export class SaleComponent implements OnInit {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Sale[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditSale = false;
  addEditData = new Sale();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  budgetPeriodList: any = [];
  budgetPeriodDetailList: any = [];
  productGroupList: any = [];
  saleTypeList: any = [];
  contractList: any = [];
  companyList: any = [];


  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getList();
    this.getCompanyLst();
    this.searchForm = new FormGroup({
      budgetPeriodId: new FormControl(null),
      periodId: new FormControl(null),
      budgetPeriodDetailId: new FormControl(null),
      contractId: new FormControl(null),
      saleType: new FormControl(null),
      productGroupId: new FormControl(null),
      companyId: new FormControl(null)
    });
  }

  getList() {
    
    this.getProductGroupLst();
    this.getAllSaleTypeLst();
    this.getContractList();
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
  getPeriodLst(companyId:number) {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown/' + companyId)
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

  getAllSaleTypeLst() {
    this.httpService
      .get<Sale[]>(Sale.typesApiAddress + 'GetAllSaleTypes')
      .subscribe(response => {
        if (response.data) {
          this.saleTypeList = response.data;
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
  onChangePeriod(e: any) {
    this.getPeriodDetailLst(e.value);
  }
  onChangeCompanyId(e: any) {
    this.getPeriodLst(e.value);
  }
  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodDetailList = response.data.result;
        }
      });
  }
  getSale(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.searchForm.value;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      ...formValue
    };

    this.loading = true;

    this.first = 0;
    const url = Sale.apiAddress + 'GetAllSales';
    this.httpService
      .post<Sale[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Sale()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addSale() {
    this.modalTitle = 'افزودن  نوع فروش جدید';
    this.mode = 'insert';
    this.isOpenAddEditSale = true;
  }

  editRow(data: Sale) {
    this.modalTitle =
      'ویرایش ' +
      '"' +
      data.budgetPeriodTitle +
      '-' +
      data.budgetPeriodDetailTitle +
      '"';
    this.getRowDataById(data.id);
  }

  getRowDataById(id: number) {
    this.httpService
      .get<Sale>(Sale.apiAddress + 'GetSaleById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.addEditData = response.data.result;
          this.mode = 'edit';
          this.isOpenAddEditSale = true;
        }
      });
  }

  deleteRow(period: Sale) {
    if (period && period.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${period.budgetPeriodTitle} - ${period.budgetPeriodDetailTitle}" اطمینان دارید؟`,
        header: `عنوان "${period.budgetPeriodTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteSale(period.id, period.budgetPeriodTitle),
      });
  }

  deleteSale(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<Sale>(
          UrlBuilder.build(Sale.apiAddress + 'DeleteSale', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'sale',
              life: 8000,
              severity: 'success',
              detail: `نوع فروش  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getSale();
          }
        });
    }
  }
  closeModal() {
    this.isOpenAddEditSale = false;
  }
  reloadData() {
    this.isOpenAddEditSale = false;
    this.getSale();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getSale();
  }
}
