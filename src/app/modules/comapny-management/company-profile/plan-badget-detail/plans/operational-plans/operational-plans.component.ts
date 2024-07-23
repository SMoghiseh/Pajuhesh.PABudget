import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-operational-plans',
  templateUrl: './operational-plans.component.html',
  styleUrls: ['./operational-plans.component.scss']
})
export class OperationalPlansComponent {

  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'برنامه های عملیاتی';

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressOperationalPlans, ''), body)
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

