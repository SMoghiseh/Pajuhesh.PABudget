import { Component, OnInit } from '@angular/core';
import { Pagination, Period, CompanyManager, UrlBuilder, Company } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'PABudget-senior-managers',
  templateUrl: './senior-managers.component.html',
  styleUrls: ['./senior-managers.component.scss'],
  providers: [ConfirmationService],

})
export class SeniorManagersComponent implements OnInit {

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: CompanyManager[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditManager = false;
  addEditData = new CompanyManager();
  pId!: string;
  mode!: string;

  // dropdown data list
  companyList: any = [];
  selectedCompany: any = {};

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getCompanyLst();
    // this.searchForm = new FormGroup({
    //   companyId: new FormControl(0)
    // });
  }

  getCompanyLst() {
    this.httpService
      .get<Period[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
          this.selectedCompany = this.companyList[0];
          this.getManagerList(this.selectedCompany.userId)
        }
      });
  }


  getManagerList(event?: LazyLoadEvent) {

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      companyId: this.selectedCompany.id
    };

    this.loading = true;

    this.first = 0;
    const url = CompanyManager.apiAddress + 'GetPersons';
    this.httpService
      .post<CompanyManager[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new CompanyManager()];
        })
      )
      .subscribe(res => (this.data = res));
  }


  onCompanySelected(event: any) {
    this.selectedCompany = event?.value;
    this.getManagerList(this.selectedCompany.userId);
  }

  addManager() {
    this.modalTitle = 'افزودن مدیر ارشد جدید';
    this.mode = 'insert';
    this.isOpenAddEditManager = true;
    this.addEditData = this.selectedCompany;
  }

  editRow(data: CompanyManager) {
    this.modalTitle =
      'ویرایش ' +
      data.managerTypeTitle + '-' + data.name + ' ' + data.lastName;
    this.getRowDataById(data.id);
  }

  getRowDataById(id: number) {
    this.httpService
      .get<CompanyManager>(CompanyManager.apiAddress + 'GetById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.addEditData = response.data.result;
          this.mode = 'edit';
          this.isOpenAddEditManager = true;
        }
      });
  }

  deleteRow(item: CompanyManager) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.managerTypeTitle} - ${item.name} ${item.lastName}" اطمینان دارید؟`,
        header: `عنوان "${item.managerTypeTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteManager(item),
      });
  }

  deleteManager(item: CompanyManager) {
    if (item.id) {
      this.httpService
        .get<CompanyManager>(
          UrlBuilder.build(CompanyManager.apiAddress + 'delete', '') + `/${item.id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'manager',
              life: 8000,
              severity: 'success',
              detail: `عنوان ${item.managerTypeTitle} - ${item.name} ${item.lastName}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getManagerList();
          }
        });
    }
  }
  closeModal() {
    this.isOpenAddEditManager = false;
  }
  reloadData() {
    this.isOpenAddEditManager = false;
    this.getManagerList();
  }

}
