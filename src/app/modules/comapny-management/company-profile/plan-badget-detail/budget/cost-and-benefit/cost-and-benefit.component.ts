import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Budget, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-cost-and-benefit',
  templateUrl: './cost-and-benefit.component.html',
  styleUrls: ['./cost-and-benefit.component.scss']
})
export class CostAndBenefitComponent {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'سود و زیان';
  selectedRows: any = [];

  constructor(private httpService: HttpService) { }

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId
    };
    this.httpService
      .post<any>(UrlBuilder.build(Budget.apiAddressCostAndBenefit, ''), body)
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
