import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Budget, Profile, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'PABudget-cost-and-benefit',
  templateUrl: './cost-and-benefit.component.html',
  styleUrls: ['./cost-and-benefit.component.scss'],
})
export class CostAndBenefitComponent {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'سود و زیان';
  selectedRows: any = [];
  isShowChart = false;
  lineChart1: any;
  isSelectTable = true;
  selectedYerId: any;

  constructor(private httpService: HttpService) {}

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
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
    this.selectedYerId = e;
    if (this.isSelectTable) this.getPlanDetail(e);
    else this.getChart();
  }

  selectTable() {
    this.isSelectTable = true;
    this.selectDateType = 'single';
    this.isShowChart = false;
    this.selectedRows = [];
  }

  getChart() {
    if (this.selectedRows?.length > 0) {
      this.selectDateType = 'multiple';
      this.isShowChart = true;
      this.isSelectTable = false;
      const type = typeof this.selectedYerId;
      let arr = [];
      if (type === 'number') arr.push(this.selectedYerId);
      else arr = this.selectedYerId;
      const body = {
        companyId: this.inputData.companyId,
        reportTypeId: this.selectedRows,
        yearId: arr,
      };
      this.httpService
        .post<any>(UrlBuilder.build(Profile.apiAddressGetChart, ''), body)
        .pipe(
          map(response => {
            if (response.data && response.data.result) {
              return response.data.result;
            } else return [];
          })
        )
        .subscribe(res => {
          if (this.lineChart1) this.lineChart1.destroy();
          this.createLineChart(res);
        });
    }
  }

  createLineChart(data: any) {
    this.lineChart1 = new Chart('LineChart', {
      type: 'line',
      data: data,
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                family: 'shabnam',
              },
            },
          },
          tooltip: {
            titleFont: {
              family: 'shabnam',
            },
            bodyFont: {
              family: 'shabnam',
            },
          },
        },

        responsive: true,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
          },
        },
      },
    });
  }
}
