import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { personsCompany, Company } from '@shared/models/response.model';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-persons-company',
  templateUrl: './persons-company.component.html',
  styleUrls: ['./persons-company.component.scss'],
})
export class PersonsCompanyComponent implements OnInit {
  personsCompanyList: personsCompany[] = [];
  personscompany = '';
  totalCount!: number;
  loading = false;
  companyId = '';

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.companyId = params['id'];
      this.getPersonsList();
      // console.log(params['id']);
      // ;
      // console.log(params);
    });
    // this.route.params.subscribe(params => {
    //   this.testId = params['id']; // Access the 'id' parameter from the URL
    //   console.log('Company ID:', this.testId);
    // });
  }

  getPersonsList() {
    this.httpService
      .post<Company[]>(personsCompany.apiAddress, {
        // id: this.selectedCompany.id || 0,
        // pageNumber: pagination.pageNumber,
        // pageSize: pagination.pageSize,
        // companyName: companyName
        managerTypeId: 38,
        companyId: this.companyId,
      })
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.totalCount != undefined)
            this.totalCount = response.data.totalCount;
          if (response.data && response.data.result)
            return response.data.result;
          else return [new personsCompany()];
        })
      )
      .subscribe(personsCompany => {
        this.personsCompanyList = personsCompany;
      });
  }
}
