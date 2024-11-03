import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { Chart } from 'chart.js';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-shareholder',
  templateUrl: './shareholder.component.html',
  styleUrls: ['./shareholder.component.scss'],
})
export class ShareholderComponent {
  @Input() inputData: any;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  planDetailData: any;
  selectDateType = 'single';
  first = 0;
  createPieChart: any;
  cols: any = [];
  tableData: any = [];
  ShareHolderCompanyDashPieLst: any = [];
  afdLst: any = [];
  selectedYerId: any;
  totalCount!: number;
  loading = false;
  viewMode: 'table' | 'chart' | 'treeTable' = 'table';
  selectedPlanName = 'سهامداران ';

  ngOnInit(): void {}
  constructor(private httpService: HttpService) {}

  getShareholder(yearId: number) {
    // this.getShareHolderCompanyDashboard(e);
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressShareHolder, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(result => {
        this.tableData = result.body;
        this.cols = result.headers;
      });
  }
  returnSelectedDate(e: any) {
    this.selectedYerId = e;
    if (this.viewMode == 'table') this.getShareholder(e);
    this.getShareHolderCompanyDashboard(e);
  }

  getShareHolderCompanyDashboard(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressPieChart, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data) return response.data;
          else return;
        })
      )
      .subscribe(ShareHolderCompanyDashLst => {
        this.ShareHolderCompanyDashPieLst = ShareHolderCompanyDashLst?.result;
        let labels: any = [];
        let data: any = [];
        labels = ShareHolderCompanyDashLst?.result.labels;
        data = ShareHolderCompanyDashLst?.result.data;
        if (this.createPieChart) this.createPieChart.destroy();
        this.createChart(labels, data);
      });
  }

  createChart(labels: any, counts: any) {
    if (labels) {
      this.createPieChart = new Chart('PieChart1', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: counts,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: false,
              text: 'سهامداران',
              font: {
                family: 'shabnam',
              },
            },
            legend: {
              position: 'bottom',
              display: true,
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 10,
                boxHeight: 10,
                font: {
                  family: 'shabnam',
                  size: 11,
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
        },
      });
    }
  }
}
