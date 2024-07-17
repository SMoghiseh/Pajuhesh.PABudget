import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.scss']
})
export class RiskComponent {

  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'ریسک ها';

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) {debugger
    const body = {
      companyId: this.inputData.companyId,
      staticYearId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressRisk, ''), body)
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
