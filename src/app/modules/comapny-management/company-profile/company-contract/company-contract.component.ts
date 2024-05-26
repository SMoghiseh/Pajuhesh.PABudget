import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '@shared/models/response.model';

@Component({
  selector: 'app-company-contract',
  templateUrl: './company-contract.component.html',
  styleUrls: ['./company-contract.component.scss'],
})
export class CompanyContractComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Company[] = [];
  loading = false;
  dataTableFirst = 0;
  constructor(private router: Router) {}

  editRow(company: Company) {
    this.router.navigate(['/Comapny/CompanyForm'], {
      queryParams: { companyId: company.id },
    });
  }

  deleteRow(company: Company) {}
  addCompany(company: Company) {
    this.router.navigate(['/Comapny/CompanyForm'], {
      queryParams: { parentId: company.id },
    });
  }
  selectAuditors(company: Company) {}
  addContract() { debugger
    this.router.navigate(['/Comapny/ContractForm']);
  }
}
