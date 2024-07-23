import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss']
})
export class OrientationComponent {
  @Input() inputData: any;

  dataList: any;
  selectDateType = 'single';
  selectedPlanName = '  جهت گیری';

  constructor(private httpService: HttpService) { }

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressOrientation, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.dataList = res;debugger
      });
  }

  returnSelectedDate(e: any) {
    this.getPlanDetail(e);
  }
}
