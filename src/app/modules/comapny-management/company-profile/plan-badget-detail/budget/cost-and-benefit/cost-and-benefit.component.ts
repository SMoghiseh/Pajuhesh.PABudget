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
  lineChart2: any;
  isSelectTable = true;
  isSelectAllChart = false;
  selectedYerId: any;
  priceTypeList: any;
  selectedPriceTypeId!: number;
  allChartsData: any;

  constructor(private httpService: HttpService) { }

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
    else {
      if (this.selectedPriceTypeId == 0) {
        this.getChart(1, 1);
        this.getChart(2, 2);
      } else this.getChart(this.selectedPriceTypeId);
    }

  }

  selectTable() {
    this.isSelectTable = true;
    this.selectDateType = 'single';
    this.isShowChart = false;
    this.selectedRows = [];
  }

  createRequestBody(priceTypeId: number) {
    this.selectDateType = 'multiple';
    this.isShowChart = true;
    this.isSelectTable = false;
    const type = typeof this.selectedYerId;
    let arr = [];
    if (type === 'number') arr.push(this.selectedYerId);
    else arr = this.selectedYerId;

    return {
      companyId: this.inputData.companyId,
      reportTypeId: this.selectedRows,
      yearId: arr,
      priceType: priceTypeId,
    };

  }

  getChart(chartId?: number, priceType?: number) {
    if (!chartId) chartId = 2;    // انتخاب پیش فرض عملکرد
    if (!priceType) priceType = this.selectedPriceTypeId;

    if (this.selectedRows?.length > 0) {
      let body = this.createRequestBody(priceType);

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
          this.allChartsData = res;
          this.createLineChart(res[0], chartId);

        });
    }
  }

  createLineChart(data: any, indx: any) {
    if (indx == 1) {
      this.lineChart1?.destroy();
    }
    if (indx == 2) {
      this.lineChart2?.destroy();
    }

    let chart;
    chart = new Chart('LineChart' + indx, {
      type: 'line',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: data.title,
            padding: {
              top: 10,
              bottom: 30
            }
          },
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

    if (indx == 1) {
      this.lineChart1 = chart;
    }
    if (indx == 2) {
      this.lineChart2 = chart;
    }

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


    // نمایش جدول
    if (!this.isShowChart) this.getPlanDetail(this.selectedYerId);

    // نمایش چارت 
    if (id == 1 || id == 2) {
      this.getChart(id, id);
    }
    else if (id == 0) {
      // عملکرد و بودجه
      // نمایش هر دو چارت
      this.getChart(2, 2);
      this.getChart(1, 1);
    }

  }

}
