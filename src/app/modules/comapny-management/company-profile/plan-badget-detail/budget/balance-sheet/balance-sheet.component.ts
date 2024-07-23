import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Budget, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'ترازنامه';
  selectedRows:any = []

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Budget.apiAddressBalanceSheet, ''), body)
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
}
