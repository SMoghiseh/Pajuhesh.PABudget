import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-vision-and-mission',
  templateUrl: './vision-and-mission.component.html',
  styleUrls: ['./vision-and-mission.component.scss'],
})
export class VisionAndMissionComponent implements OnInit {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'چشم انداز و ماموریت';

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getPlanDetail();
  }

  getPlanDetail() {
    const body = {
      companyId: this.inputData.companyId
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressVisionAndMission, ''), body)
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

}
