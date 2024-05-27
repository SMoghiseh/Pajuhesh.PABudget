import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  Company, DeleteCompany, UrlBuilder
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

  /*--------------------------
  # Table
  --------------------------*/
  totalCount!: number;
  data: Company[] = [];
  loading = false;
  dataTableRows = 10;
  /*--------------------------
# Table
--------------------------*/

  selectedCompany: any = {};
  dataTableFirst = 0;
  gridClass = 'p-datatable-sm';
  lazyLoadEvent?: LazyLoadEvent;
  subCompanies: Company[] = [];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSubCompanies();
  }



  /*--------------------------
  # GET
  --------------------------*/
  getSubCompanies(event?: LazyLoadEvent) {


    this.httpService
      .get<Company[]>(`${Company.apiAddressSubCompanies}0`,
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
      .subscribe(companyList => {
        this.subCompanies = companyList;
        this.selectedCompany = this.subCompanies[0];
        this.getSubsets(this.selectedCompany.id)
      });
  }


  onCompanySelected(event: any) {
    this.selectedCompany = event?.value;
    this.getSubsets(this.selectedCompany.id);
  }

  /*--------------------------
# GET
--------------------------*/
  getSubsets(id: number) {
    this.httpService
      .get<Company[]>(`${Company.apiAddressSubCompanies}${id}`)
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
      .subscribe(data => {
        this.data = data;
      });
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

  personscompany(company: Company) {
    this.router.navigate(['/Comapny/personscompany/' + company.id]);

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

  addCompany(company: Company) {
    this.router.navigate(['/Comapny/CompanyForm'], { queryParams: { parentId: company.id } })
  }

  editRow(company: Company) {
    this.router.navigate(['/Comapny/CompanyForm'], { queryParams: { companyId: company.id } });
  }

  selectBoardOfManagments(company: Company) { }

  selectAuditors(company: Company) { }
}
