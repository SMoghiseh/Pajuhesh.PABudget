import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Budget, Profile, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import Chart from 'chart.js/auto';
import { LazyLoadEvent } from 'primeng/api';

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
  lazyLoadEvent?: LazyLoadEvent;
  isShowChart = false;
  dataTableRows = 15;
  gridClass = 'p-datatable-sm';
  loading = false;
  cols: any = [];
  totalCount!: number;
  lineChart1: any;
  lineChart2: any;
  isSelectTable = true;
  isSelectAllChart = false;
  isSelectedCompareBudgetWithReal = false;
  isSelectedCompareBudgetWithBudget = false;
  isSelectedCompareRealWithBudget = false;
  selectedYerId: any;
  priceTypeList: any;
  selectedPriceTypeId!: number;
  allChartsData: any;
  compareBudgetWithRealTable: Budget[] = [];

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
    debugger;
    this.selectedYerId = e;
    if (this.isSelectTable) this.getPlanDetail(e);
    else {
      if (this.selectedPriceTypeId == 0) {
        this.getChart(1, 1);
        this.getChart(2, 2);
      } else this.getChart(this.selectedPriceTypeId);
    }
    if (this.isSelectedCompareBudgetWithReal) this.getCompareBudgetWithReal(e);
    if (this.isSelectedCompareBudgetWithBudget)
      this.getCompareBudgetWithBudget(e);
    if (this.isSelectedCompareRealWithBudget) this.getCompareRealWithBudget(e);
  }

  selectTable() {
    this.isSelectTable = true;
    this.isSelectedCompareBudgetWithReal = false;
    this.isSelectedCompareBudgetWithBudget = false;
    this.isSelectedCompareRealWithBudget = false;
    this.selectDateType = 'single';
    this.isShowChart = false;
    this.selectedRows = [];
    this.compareBudgetWithRealTable = [];
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
    if (!chartId) chartId = 2; // انتخاب پیش فرض عملکرد
    if (!priceType) priceType = this.selectedPriceTypeId;

    if (this.selectedRows?.length > 0) {
      const body = this.createRequestBody(priceType);

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

  compareBudgetWithReal() {
    debugger;
    this.planDetailData = '';
    this.priceTypeList = [];
    this.isSelectTable = false;
    this.isShowChart = false;
    this.isSelectedCompareBudgetWithReal = true;
    this.isSelectedCompareBudgetWithBudget = false;
    this.isSelectedCompareRealWithBudget = false;

    this.selectDateType = 'double';
  }
  compareBudgetWithBudget() {
    debugger;
    this.planDetailData = '';
    this.compareBudgetWithRealTable = [];
    this.priceTypeList = [];
    this.isSelectTable = false;
    this.isShowChart = false;
    this.isSelectedCompareBudgetWithBudget = true;
    this.isSelectedCompareBudgetWithReal = false;
    this.isSelectedCompareRealWithBudget = false;
    this.selectDateType = 'double';
  }

  compareRealWithBudget() {
    debugger;
    this.planDetailData = '';
    this.priceTypeList = [];
    this.isSelectTable = false;
    this.isShowChart = false;
    this.isSelectedCompareRealWithBudget = true;
    this.isSelectedCompareBudgetWithReal = false;
    this.isSelectedCompareBudgetWithBudget = false;
    this.selectDateType = 'double';
  }
  getCompareBudgetWithReal(yearId?: any) {
    debugger;
    const type = typeof this.selectedYerId;
    const lastYear = this.selectedYerId;
    let arr = [];
    if (type === 'number') {
      arr.push(this.selectedYerId);
      arr.push(lastYear);
    } else arr = this.selectedYerId;

    const body = {
      companyId: this.inputData.companyId,
      firstPeriodId: arr[0],
      secondPeriodId: arr[1],
      accountReportCode: null,
    };
    this.httpService
      .post<any>(
        UrlBuilder.build(Budget.apiAddressCompareBudgetWithReal, ''),
        body
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.compareBudgetWithRealTable = result.compareReportDetail;
        this.cols = result.headers;
      });
  }
  getCompareBudgetWithBudget(yearId?: any) {
    debugger;
  }
  getCompareRealWithBudget(yearId?: any) {
    debugger;
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
              bottom: 30,
            },
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
    } else if (id == 0) {
      // عملکرد و بودجه
      // نمایش هر دو چارت
      this.getChart(2, 2);
      this.getChart(1, 1);
    }
  }
}
