import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent  {
  @Input() inputData: any;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  first = 0;
  totalCount!: number;
  planDetailData: any;
  loading = false;
  selectDateType = 'single';
  selectedPlanName = ' اهداف کلان ';

  // yearActivityDataList properties
  isOpenDataList = false;
  modalTitle = '';
  yearActivityDataList: any;
  yearActivityGridClass = 'p-datatable-sm';
  yearActivityDataTableRows = 10;
  yearActivityFirst = 0;
  yearActivityTotalCount!: number;


  constructor(private httpService: HttpService) { }
  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressGoals, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.planDetailData = res;
      });
  }

  returnSelectedDate(e: any) {
    this.getPlanDetail(e);
  }

  showYearActivityList(data: any) {
    this.modalTitle = 'لیست برنامه های عملیاتی' + ' " ' + data?.desc?.substring(0, 40) + ' ... ' + ' " ';
    this.isOpenDataList = true;
    this.yearActivityDataList = data.titleYearActivityList;
  }

  closeModal() {
    this.isOpenDataList = false;
  }
}
