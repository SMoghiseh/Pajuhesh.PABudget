import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Budget, Profile, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import Chart from 'chart.js/auto';
import { LazyLoadEvent, MenuItem, PrimeIcons, TreeNode } from 'primeng/api';
import { Colors } from 'chart.js';
import { title } from 'process';
import { style } from '@angular/animations';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'PABudget-cost-and-benefit',
  templateUrl: './cost-and-benefit.component.html',
  styleUrls: ['./cost-and-benefit.component.scss'],
})
export class CostAndBenefitComponent implements OnInit {
  @Input() inputData: any;

  treeTableData: any;
  tableData: any = [];
  selectDateType: 'single' | 'double' | 'multiple' = 'single';
  selectedPlanName = 'سود و زیان';
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
  selectedPriceTypeId!: number;
  allChartsData: any;
  signalenCodeNode: any;
  signalenBrin: any;
  signalenVestigingNode: any;
  listOfBudgetReport: Budget[] = [];
  selectedlistOfBudgetReport: any = [];
  items: MenuItem[] | undefined;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getPriceType();
    this.getTreeTableData();
    this.getListOfBudgetReportLst();

    // this.items = [
    //   {
    //     styleClass: 'negativeNumbers',
    //     iconStyle: 'pi pi-arrow-down',
    //   },
    //   {
    //     styleClass: 'pasitiveNumbers',
    //     iconStyle: 'pi pi-arrow-up',
    //   },
    // ];
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
  ) {  debugger
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
      priceType: this.selectedPriceTypeId,
    };
    this.httpService
      .post<any>(Budget.apiAddressCostAndBenefit, body)
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

    // for (let i = 0; this.treeTableData.budgetDetails.length > 0; i++) {
    //   if (this.treeTableData.budgetDetails[i].data.value !== 0) {
    //     const getvalue = this.treeTableData.budgetDetails[i].data.value;
    //     if (getvalue > 0) PrimeIcons.ARROW_DOWN;
    //     else PrimeIcons.ARROW_UP;
    //   }
    // }
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
  nodeSelect(event: { originalEvent: any; node: TreeNode<any> }) {
    debugger;
    if (event.node.children) {
      // this.signalenCodeNode = event.node.data;
      // this.getParentDetails(event.node);
      const nodeArray = event.node.children;
      for (let i = 0; i <= nodeArray.length; i++) {
        event.node.children[i].partialSelected = true;

        // event.originalEvent.rowNode.visible = true;
      }
    }
  }
  nodeUnSelected(event: any) {
    debugger
  }
  getParentDetails(node: TreeNode) {
    debugger;
    if (node.parent) {
      this.signalenVestigingNode = node.parent.data;
      if (node.parent.parent) {
        this.signalenBrin = node.parent.parent.data;
      }
    }
  }
  getTableData(comparison: number) { debugger
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
}
