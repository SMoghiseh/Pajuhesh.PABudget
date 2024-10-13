import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-matrix-swot',
  templateUrl: './matrix-swot.component.html',
  styleUrls: ['./matrix-swot.component.scss'],
})
export class MatrixSwotComponent {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'ماتریس SWOT ';

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) { debugger
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressSWOT, ''), body)
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

  returnSelectedDate(e: any) { debugger
    this.getPlanDetail(e);
  }
}
