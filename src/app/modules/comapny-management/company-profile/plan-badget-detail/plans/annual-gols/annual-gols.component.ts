import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-annual-gols',
  templateUrl: './annual-gols.component.html',
  styleUrls: ['./annual-gols.component.scss']
})
export class AnnualGolsComponent {
  @Input() inputData: any;

  dataList: any;
  selectDateType = 'single';
  selectedPlanName = 'اهداف سالیانه';

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressAnnualGols, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.dataList = res;
      });
  }

  returnSelectedDate(e: any) {
    this.getPlanDetail(e);
  }
}
