import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Reports } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-all-company-reports',
  templateUrl: './all-company-reports.component.html',
  styleUrls: ['./all-company-reports.component.scss'],
})
export class AllCompanyReportsComponent implements OnInit {

  // reports list
  boardmembersList = { names: [], average: '' }
  companyManagerActivity: any;
  planList: any;
  service: any

  selectedTab = 0;
  tabContent = 'tab_1';
  tabList = [
    { id: 1, title: 'بنگاه داری' },
    { id: 2, title: 'تامین اجتماعی ' },
    { id: 3, title: ' سازمانی' },
  ];


  constructor( private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.GetBoardmembers();
    this.GetCompanyManagerActivity();
    this.Getplan();
  }


  /*--------------------------
  # GET
  --------------------------*/
  GetBoardmembers() {
    this.httpService
      .get<any>(Reports.apiAddressBoardmembers,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.boardmembersList.average = result.average;
        this.boardmembersList.names = result.name;
      });
  }

  /*--------------------------
  # GET
  --------------------------*/
  GetCompanyManagerActivity() {
    this.httpService
      .get<any>(Reports.apiAddressCompanyManagerActivity,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return {};
        })
      )
      .subscribe(result => {
        this.companyManagerActivity = result;
      });
  }

  /*--------------------------
  # GET
  --------------------------*/
  Getplan() {
    this.httpService
      .get<any>(Reports.apiAddressplan,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.planList = result;
      });
  }



  showTemplate(id: number, index: number) {
    this.selectedTab = index;
    this.tabContent = 'tab_' + id;
  }
}
