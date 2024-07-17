import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'ارزش ها';

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) {debugger
    const body = {
      companyId: this.inputData.companyId,
      staticYearId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressValue, ''), body)
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
