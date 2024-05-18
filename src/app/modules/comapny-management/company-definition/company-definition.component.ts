import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  ActivityType,
  Company,
  CompanyInspectionInstitute,
  CompanyType,
  DeleteCompany,
  ListCompany,
  Pagination,
  PublisherStatus,
  ReportingType,
  UrlBuilder,
} from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-company-definition',
  templateUrl: './company-definition.component.html',
  styleUrls: ['./company-definition.component.scss'],
  providers: [ConfirmationService],
})
export class CompanyDefinitionComponent implements OnInit {
  /** نوع فعالبت انتخاب شده */
  selectedActivityType = new ActivityType();

  /** نوع شرکت انتخاب شده */
  selectedCompanyType = new CompanyType();

  // selectedParent = new Company();

  selectedReportingType = new ReportingType();

  selectedPublisherStatus = new PublisherStatus();

  /** موسسه حسابرسی شرکت انتخاب شده */
  selectedCompanyInspectionInstitute = new CompanyInspectionInstitute();

  /*--------------------------
  # Table
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  companyList: Company[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  selectedCompany = new Company();

  previewDetailsDialog = false;

  fomrCollapsed = true;

  selectedSubject = new Company();

  /** Main table first row */
  dataTableFirst = 0;

  gridClass = 'p-datatable-sm';

  selectedCompanyId = 0;

  lazyLoadEvent?: LazyLoadEvent;

  editCompanyData = new Company();

  isOpenAddCompany = false;

  searchCompanyForm!: FormGroup;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchCompanyForm = new FormGroup({
      companyName: new FormControl(),
    });

    this.getCompanyList();

  }



  /*--------------------------
  # GET
  --------------------------*/
  getCompanyList(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const { companyName } = this.searchCompanyForm.value;
    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<Company[]>(ListCompany.apiAddress,
        {
          // id: this.selectedCompany.id || 0,
          // pageNumber: pagination.pageNumber,
          // pageSize: pagination.pageSize,
          // companyName: companyName
        }
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.totalCount != undefined)
            this.totalCount = response.data.totalCount;
          if (response.data && response.data.result)
            return response.data.result;
          else return [new Company()];
        })
      )
      .subscribe(companyList => (this.companyList = companyList));
  }


  onCompanySelected(event: any) {
    this.selectedCompany = event.value;
    debugger
  }

  /*--------------------------
# GET
--------------------------*/
  getDataList(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const { companyName } = this.searchCompanyForm.value;
    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<Company[]>(ListCompany.apiAddress, {


        id: this.selectedCompany.id || 0,
        withOutPagination: true,

      })
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.totalCount != undefined)
            this.totalCount = response.data.totalCount;
          if (response.data && response.data.result)
            return response.data.result;
          else return [new Company()];
        })
      )
      .subscribe(companyList => {
        this.companyList = companyList;
        this.selectedCompany = this.companyList[0];
      });
  }

  /*--------------------------
  # DETAILS
  --------------------------*/
  /**
   * Show report details modal.
   * @param report report details model
   */
  previewDetails(company: Company) {
    // this.selectedCompany = company;
    // this.previewDetailsDialog = true;
  }

  editRow(company: Company) {
    // this.isOpenAddCompany = true;
    // this.editCompanyData = company;
  }

  deleteRow(company: Company) {
    if (company && company.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف شرکت اطمینان دارید؟',
        header: `عنوان ${company.companyName}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteCompany(company.id, company.companyName),
      });
  }

  deleteCompany(id: number, companyName: string) {
    if (id && companyName) {
      this.httpService
        .delete<Company>(
          UrlBuilder.build(DeleteCompany.apiAddress, 'DELETE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.dataTableFirst = 0;
            this.getDataList();

            this.messageService.add({
              key: 'subjectDefinition',
              life: 8000,
              severity: 'success',
              detail: `شرکت ${companyName}`,
              summary: 'با موفقیت حذف شد',
            });
          }
        });
    }
  }

  onOpenAddCompany() {
    this.editCompanyData = new Company();
    // this.isOpenAddCompany = true;
    this.router.navigate([`/Comapny/createCompanyForm/${this.selectedCompany.id}`]);
  }

  onCloseModal() {
    this.isOpenAddCompany = false;
    this.getCompanyList();
  }

  selectBoardOfManagments(company: Company) { }

  selectAuditors(company: Company) { }
}
