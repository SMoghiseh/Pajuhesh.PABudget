import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'اهداف';

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      staticYearId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressGoals, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result.datasDescs;
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
