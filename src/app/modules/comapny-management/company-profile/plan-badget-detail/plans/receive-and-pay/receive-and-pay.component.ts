import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  Profile,
  ReceiveAndPay,
  UrlBuilder,
} from '@shared/models/response.model';
import { LazyLoadEvent } from 'primeng/api';
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
  viewMode: 'table' | 'chart' | 'treeTable' = 'treeTable';
  comparisonTableId = 0;
  selectedYerId: any;
  priceTypeList: any;
  selectedPriceTypeId!: number;
  allChartsData: any;
  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    this.getPriceType();
    this.getTreeTableData();
  }
  returnSelectedDate(e: any) {
    this.selectedYerId = e;
    this.reloadFilteredData();
  }
  reloadFilteredData() {
    if (this.viewMode == 'treeTable') this.getTreeTableData();
    if (this.viewMode == 'table') this.getTableData(this.comparisonTableId);
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
      priceType: this.selectedPriceTypeId,
    };
    this.httpService
      .post<any>(ReceiveAndPay.apiAddressReceiveAndPay, body)
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

  getTableData(comparison: number) {
    let url = '';
    if (this.viewMode == 'table') {
      if (comparison == 1) url = ReceiveAndPay.apiAddressReceiveAndPay;
      // if (comparison == 2) url = StatementCashFlows.apiAddressCompareBudgetWithBudget;
      // if (comparison == 3) url = StatementCashFlows.apiAddressCompareRealWithBudget;
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
  }
}
