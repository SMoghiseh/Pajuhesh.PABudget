import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  ShareHolder, Company
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-share-holder-company',
  templateUrl: './share-holder-company.component.html',
  styleUrls: ['./share-holder-company.component.scss'],
  providers: [ConfirmationService]
})
export class ShareHolderCompanyComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: ShareHolder[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditShareHolder = false;
  addEditData = new ShareHolder();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  aspectCodeList: any = [];
  companyList: any = [];
  bigGoalList: any = [];
  subComponentList = [
    {
      label: ' برنامه عملیاتی ',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Period/YearActivity'],
    },
  ];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCompanyLst();
    this.searchForm = new FormGroup({
      companyId: new FormControl(0)
    });
  }

  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
          this.searchForm.patchValue({
            companyId: this.companyList[0].id
          })
          this.getList();
        }
      });
  }

  getList(event?: LazyLoadEvent) {
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
      ...formValue,
    };

    body.companyId = body.companyId ? body.companyId :
      this.companyList[0]?.id;

    this.first = 0;
    const url = ShareHolder.apiAddress + 'GetShareHolderList';
    this.httpService
      .post<ShareHolder[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new ShareHolder()];
        })
      )
      .subscribe(res => {
        this.data = res;
      });
  }

  addShareHolder() {
    this.modalTitle = 'افزودن';
    this.mode = 'insert';
    this.isOpenAddEditShareHolder = true;
  }

  editRow(data: ShareHolder) {
    this.modalTitle = 'ویرایش ';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditShareHolder = true;
  }

  deleteRow(item: ShareHolder) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.partyName} " اطمینان دارید؟`,
        header: `عنوان "${item.partyName}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteShareHolder(item.id, item.partyName),
      });
  }

  deleteShareHolder(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<ShareHolder>(
          UrlBuilder.build(ShareHolder.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'سhareHolder',
              life: 8000,
              severity: 'success',
              detail: `  مورد  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getList();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditShareHolder = false;
    this.getList();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getList();
  }

}
