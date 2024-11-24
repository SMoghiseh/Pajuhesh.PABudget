import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  Budget,
  Profile,
  ReceiveAndPay,
  UrlBuilder,
} from '@shared/models/response.model';
import { Chart } from 'chart.js';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-receive-and-pay',
  templateUrl: './receive-and-pay.component.html',
  styleUrls: ['./receive-and-pay.component.scss'],
})
export class ReceiveAndPayComponent {
  @Input() inputData: any;

  treeTableData: any;
  tableData: any = [];
  selectDateType: 'single' | 'double' | 'multiple' = 'single';
  selectedPlanName = 'دریافت ها و پرداخت ها';
  selectedRows: any = [];
  lazyLoadEvent?: LazyLoadEvent;
  isShowChart = false;
  dataTableRows = 15;
  gridClass = 'p-datatable-sm';
  loading = false;
  cols: any = [];
  lineChart1: any;
  lineChart2: any;
  reportItemTypeList: any;
  selectedReportTypeId!: number;
  selectedPriceTypeId!: number;
  viewMode: 'table' | 'chart' | 'treeTable' = 'treeTable';
  comparisonTableId = 0;
  selectedYerId: any;
  priceTypeList: any;
  allChartsData: any;
  listOfBudgetReport: any = [];
  selectedlistOfBudgetReport: any = [];
  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    this.getReportItemType(this.inputData.companyId);
    this.getTreeTableData();
    this.getListOfBudgetReportLst();
  }

  returnSelectedDate(e: any) {
    this.selectedYerId = e;
    this.reloadFilteredData();
  }

  formatNumber(value: number | string): string {
    if (value == null) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
    const getpartialSelected = data.filter(
      (item: any) => item.partialSelected === false
    );
    return getpartialSelected.map(item => item.data.code);
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

    if (viewMode == 'treeTable' && viewMode == this.viewMode) {
      if (this.selectedYerId.length > 0) {
        this.selectedYerId = this.selectedYerId[0];
      }
      this.getTreeTableData();
    }
    if (viewMode == 'table' && viewMode == this.viewMode)
      this.getTableData(this.comparisonTableId);
    if (viewMode == 'chart' && viewMode == this.viewMode) this.getPriceType();
    this.getChart(this.comparisonTableId);
  }

  getTreeTableData() {
    this.selectedRows = [];
    // if (!this.selectedYerId) return;
    const body = {
      companyId: this.inputData.companyId,
      periodId: this.selectedYerId.toString(),
      // priceType: this.selectedPriceTypeId,
      isConsolidated: this.selectedReportTypeId,
    };
    this.httpService
      .post<any>(Budget.apiReceiveAndPay, body)
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
        res.forEach((element: any) => {
          if (element.id === 2) element.isSelected = true;
          else element.isSelected = false;
        });
        this.priceTypeList = res;
        this.selectedPriceTypeId = 2;
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
      .post<any>(UrlBuilder.build(url + 'CostAndBenefit', ''), body)
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
    this.selectedReportTypeId = id;

    this.reportItemTypeList.forEach((element: any) => {
      if (element.id === id) element.isSelected = true;
      else element.isSelected = false;
    });

    if (this.viewMode == 'treeTable') this.getTreeTableData();

    // if (this.viewMode == 'chart') {
    //   // نمایش چارت
    //   if (this.selectedPriceTypeId == 1 || this.selectedPriceTypeId == 2) {
    //     this.getChart(this.selectedPriceTypeId, this.selectedPriceTypeId);
    //   } else if (this.selectedPriceTypeId == 0) {
    //     // عملکرد و بودجه
    //     // نمایش هر دو چارت
    //     this.getChart(2, 2);
    //     this.getChart(1, 1);
    //   }
    // }
  }
  onSelectPriceType(id: number) {
    this.selectedPriceTypeId = id;

    this.priceTypeList.forEach((element: any) => {
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

  nodeSelect(event: { originalEvent: any; node: TreeNode<any> }) {
    if (event.node.children) {
      const nodeArray = event.node.children;
      for (let i = 0; i <= nodeArray.length; i++) {
        event.node.children[i].partialSelected = true;
      }
    }
  }

  getReportItemType(companyId: number) {
    this.httpService
      .get<any>(Profile.apiAddressReportItemCompany + companyId)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.reportItemTypeList = res;
        this.selectedReportTypeId = this.reportItemTypeList[0]['id'];
        this.reportItemTypeList[0]['isSelected'] = true;
      });
  }
}
