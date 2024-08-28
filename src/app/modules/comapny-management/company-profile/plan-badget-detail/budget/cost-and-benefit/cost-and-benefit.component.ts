import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Budget, Profile, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'PABudget-cost-and-benefit',
  templateUrl: './cost-and-benefit.component.html',
  styleUrls: ['./cost-and-benefit.component.scss'],
})
export class CostAndBenefitComponent implements OnInit {
  @Input() inputData: any;

  planDetailData: any;
  selectDateType = 'single';
  selectedPlanName = 'سود و زیان';
  selectedRows: any = [];
  isShowChart = false;
  lineChart1: any;
  isSelectTable = true;
  selectedYerId: any;
  priceTypeList: any;
  selectedPriceTypeId!: number;
  allChartsData: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getPriceType();
  }

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
      priceType: this.selectedPriceTypeId,
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
        priceType: this.selectedPriceTypeId,
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
          this.allChartsData = res;
          for (let i = 0; i < res.length; i++) {
            this.createLineChart(res[i], i);
          }
        });
    }
  }

  createLineChart(data: any, indx: number) {
    this.lineChart1 = new Chart('LineChart' + indx, {
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

  getPriceType() {
    this.httpService
      .get<any>(UrlBuilder.build(Profile.apiAddressGetPriceType, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.selectedPriceTypeId = 2;
        res.forEach((element: any) => {
          if (element.id === 2) element.isSelected = true;
          else element.isSelected = false;
        });
        this.priceTypeList = res;
      });
  }

  onSelectPriceType(id: number) {
    this.selectedPriceTypeId = id;
    this.priceTypeList.forEach((element: any) => {
      if (element.id === id) element.isSelected = true;
      else element.isSelected = false;
    });
    if (!this.isShowChart) this.getPlanDetail(this.selectedYerId);
    else this.getChart();
  }
}
