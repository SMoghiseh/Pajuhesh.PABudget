import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Reports } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-bongahdari',
  templateUrl: './bongahdari.component.html',
  styleUrls: ['./bongahdari.component.scss']
})
export class BongahdariComponent implements OnInit {
  rankingList: any;
  election: any;
  assemblies: any;
  subCompanyList: any;
  rankingManagers: any;
  legalCasesList: any;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.GetRanking();
    this.GetElection();
    this.GetAssemblies();
    this.GetRankingManagers();
    this.GetAllSubCompanyCountWithCompanyType();
    this.GetLegalCases();
  }

  /*--------------------------
# GET
--------------------------*/
  GetRanking() {
    this.httpService
      .get<any>(Reports.apiAddressRanking,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.rankingList = result;
      });
  }
  /*--------------------------
# GET
--------------------------*/
  GetElection() {
    this.httpService
      .get<any>(Reports.apiAddressElection,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.election = result;
      });
  }
  /*--------------------------
# GET
--------------------------*/
  GetAssemblies() {
    this.httpService
      .get<any>(Reports.apiAddressAssemblies,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.assemblies = result;
      });
  }
  /*--------------------------
# GET
--------------------------*/
  GetAllSubCompanyCountWithCompanyType() {
    this.httpService
      .get<any>(Reports.apiAddressAllSubCompanyCountWithCompanyType,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.subCompanyList = result;
      });
  }
  /*--------------------------
# GET
--------------------------*/
  GetRankingManagers() {
    this.httpService
      .get<any>(Reports.apiAddressRankingManagers,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.rankingManagers = result;
      });
  }
  /*--------------------------
# GET
--------------------------*/
  GetLegalCases() {
    this.httpService
      .get<any>(Reports.apiAddresslegalCases,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.legalCasesList = result;
      });
  }


}
