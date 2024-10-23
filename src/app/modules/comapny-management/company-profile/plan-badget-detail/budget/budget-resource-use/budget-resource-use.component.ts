import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Budget, Profile, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import Chart from 'chart.js/auto';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'PABudget-budget-resource-use',
  templateUrl: './budget-resource-use.component.html',
  styleUrls: ['./budget-resource-use.component.scss'],
})
export class BudgetResourceUseComponent {
  @Input() inputData: any;

  treeTableData: any;
  tableData: any = [];
  selectDateType: 'single' | 'double' | 'multiple' = 'single';
  selectedPlanName = 'منابع و مصارف';
  selectedRows: any = [];
  lazyLoadEvent?: LazyLoadEvent;
  isShowChart = false;
  dataTableRows = 15;
  gridClass = 'p-datatable-sm';
  loading = false;
  cols: any = [];
  lineChart1: any;
  lineChart2: any;
  viewMode: 'table' | 'chart' | 'treeTable' = 'treeTable';
  comparisonTableId = 0;
  selectedYerId: any;
  priceTypeList: any;
  reportItemTypeList: any;
  selectedPriceTypeId!: number;
  allChartsData: any;
  listOfBudgetReport: any = [];
  selectedlistOfBudgetReport: any = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    // this.getPriceType();
    this.getTreeTableData();
    this.getReportItemType();
    this.getListOfBudgetReportLst();
  }

  returnSelectedDate(e: any) {
    this.selectedYerId = e;
    this.reloadFilteredData();
  }

  reloadFilteredData() {
    if (this.viewMode == 'treeTable') this.getTreeTableData();
    if (this.viewMode == 'table') this.getTableData(this.comparisonTableId);
    if (this.viewMode == 'chart') this.loadChart();
  }

  loadChart() {
    if (this.selectedPriceTypeId == 0) {
      // حالت نمایش چارت ها در تب "عملکردو بودجه"
      this.getChart(1, 1);
      this.getChart(2, 2);
    } else this.getChart(this.selectedPriceTypeId);
  }

  getSelectedRowsId(data: any[]) {
    return data.map(item => item.data.code);
  }

  getListOfBudgetReportLst() {
    this.httpService
      .get<Budget[]>(Budget.apiListOfBudgetReport)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.listOfBudgetReport = response.data.result;
          this.selectedlistOfBudgetReport = response.data.result;
          for (let i = 0; this.selectedlistOfBudgetReport.length > 0; i++) {
            this.selectedlistOfBudgetReport = response.data.result[i];
          }
        }
      });
  }

  createRequestBody(priceTypeId: number) {
    this.selectDateType = 'multiple';
    this.isShowChart = true;

    const type = typeof this.selectedYerId;
    let arr = [];
    if (type === 'number') arr.push(this.selectedYerId);
    else arr = this.selectedYerId;

    return {
      companyId: this.inputData.companyId,
      reportTypeId: this.getSelectedRowsId(this.selectedRows),
      yearId: arr,
      priceType: priceTypeId,
    };
  }

  tabChange(
    viewMode: 'table' | 'chart' | 'treeTable',
    yearTypeSelection: 'single' | 'double' | 'multiple',
    tableId?: number
  ) {
    this.viewMode = viewMode;

    this.selectDateType = yearTypeSelection;
    if (tableId) this.comparisonTableId = tableId;

    if (viewMode == 'table' && viewMode == this.viewMode)
      this.getTableData(this.comparisonTableId);
  }

  getTreeTableData() {
    this.selectedRows = [];
    if (!this.selectedYerId) return;
    const body = {
      companyId: this.inputData.companyId,
      periodId: this.selectedYerId,
      isConsolidated:  this.selectedPriceTypeId,
    };
    this.httpService
      .post<any>(Budget.apiAddresBudgetResourceUse, body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.treeTableData = res;
      });
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

  getTableData(comparison: number) {
    let url = '';
    if (this.viewMode == 'table') {
      if (comparison == 1) url = Budget.apiAddressCompareBudgetWithReal;
      if (comparison == 2) url = Budget.apiAddressCompareBudgetWithBudget;
      if (comparison == 3) url = Budget.apiAddressCompareRealWithBudget;
    }
    const body = {
      accountReportCode: null,
      companyId: this.inputData.companyId,
      firstPeriodId:
        this.selectedYerId[0] < this.selectedYerId[1]
          ? this.selectedYerId[0]
          : this.selectedYerId[1],
      secondPeriodId:
        this.selectedYerId[0] > this.selectedYerId[1]
          ? this.selectedYerId[0]
          : this.selectedYerId[1],
    };
    this.httpService
      .post<any>(UrlBuilder.build(url + 'ResourceUse', ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.tableData = result.compareReportDetail;
        this.cols = result.headers;
      });
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
        elements: {
          line: {
            borderWidth: 1,
          },
        },
        plugins: {
          title: {
            display: true,
            text: data.title,
            align: 'end',

            font: {
              family: 'shabnam',
            },
            padding: {
              top: 10,
              bottom: 30,
            },
            color: '#36A2EB',
          },

          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10,

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

  onSelectReportItemType(id: number) {
    this.selectedPriceTypeId = id;

    this.reportItemTypeList.forEach((element: any) => {
      if (element.id === id) element.isSelected = true;
      else element.isSelected = false;
    });

    if (this.viewMode == 'treeTable') this.getTreeTableData();

    if (this.viewMode == 'chart') {
      // نمایش چارت
      if (this.selectedPriceTypeId == 1 || this.selectedPriceTypeId == 2) {
        this.getChart(this.selectedPriceTypeId, this.selectedPriceTypeId);
      } else if (this.selectedPriceTypeId == 0) {
        // عملکرد و بودجه
        // نمایش هر دو چارت
        this.getChart(2, 2);
        this.getChart(1, 1);
      }
    }
  }

  getReportItemType() {
    this.httpService
      .get<any>(UrlBuilder.build(Profile.apiAddressReportItemType, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {

        this.reportItemTypeList = res;
        this.selectedPriceTypeId = this.reportItemTypeList[0]['id'];
        this.reportItemTypeList[0]['isSelected'] = true;
      });
  }
}
