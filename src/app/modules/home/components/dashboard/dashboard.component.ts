import { Component, OnInit, Renderer2 } from '@angular/core';
import { Company, Dashboard, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import { HttpService } from '@core/http/http.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mySubCompanies: Company[] = [];
  selectedHoldingId: null | number = null;
  coInfo: Company = new Company();
  myChart!: Chart;
  reportTypeLst!: Dashboard[];
  selectedReportTypeId = 0;

  constructor(private httpService: HttpService, private rd: Renderer2) {}

  ngOnInit(): void {
    this.getMySubCompanies(0);
  }

  getCoApi(id: number) {
    return this.httpService.get<Company[]>(
      UrlBuilder.build(Company.apiAddressSubCompanies + id, '')
    );
  }

  getMySubCompanies(id: number) {
    this.getCoApi(id)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return new Array<Company>();
        })
      )
      .subscribe(mySubCompanies => {
        this.mySubCompanies = mySubCompanies;
        this.getReportType();
      });
  }

  onSelectCompany(company: Company) {
    this.selectCoItem(company.id);
  }

  getCoInfo(coId: number) {
    this.httpService
      .get<Company>(UrlBuilder.build(Company.apiAddressDetailCo + coId, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return new Company();
        })
      )
      .subscribe(coInfo => {
        this.coInfo = coInfo;
      });
  }

  selectCoItem(id: number) {
    this.mySubCompanies.forEach(element => {
      if (element.isSelected) element.isSelected = false;
      if (element.id === id) element.isSelected = true;
    });
    this.selectedHoldingId = id;
    this.getCoInfo(id);
    this.getReportChart();
  }

  createBarChart(labels: any, counts: any) {
    if (this.myChart) this.myChart.destroy();
    this.myChart = new Chart('BarChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: counts,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
    this.myChart.update();
  }

  getReportChart() {
    const body = {
      companyId: this.selectedHoldingId,
      reportId: this.selectedReportTypeId,
    };
    this.httpService
      .post<Dashboard>(
        UrlBuilder.build(Dashboard.apiAddressReportChart, ''),
        body
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return new Dashboard();
        })
      )
      .subscribe(coInfo => {
        const labels = coInfo.labels;
        const counts = coInfo.datasets;
        this.createBarChart(labels, counts);
      });
  }

  getReportType() {
    this.httpService
      .get<Dashboard[]>(UrlBuilder.build(Dashboard.apiAddressReportType, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return new Array<Dashboard>();
        })
      )
      .subscribe(reportType => {
        this.reportTypeLst = reportType;
        this.selectReportType(reportType[0].id);
      });
  }

  onReportType(id: number) {
    this.selectedReportTypeId = id;
    this.selectReportType(id);
    this.getReportChart();
  }

  selectReportType(id: number) {
    this.selectedReportTypeId = id;
    this.reportTypeLst.forEach(element => {
      if (element.isSelected) element.isSelected = false;
      if (element.id == id) element.isSelected = true;
    });
    if (!this.selectedHoldingId) this.selectCoItem(this.mySubCompanies[0].id);
  }
}
