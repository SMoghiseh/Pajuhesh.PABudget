import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  BaseInfo,
  Company,
  Dashboard,
  UrlBuilder,
} from '@shared/models/response.model';
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
  subCos: Company[] = [];
  selectedHoldingId: null | number = null;
  coInfo: Company = new Company();
  myChart!: Chart;
  reportTypeLst!: Dashboard[];
  selectedReportTypeId = 0;
  yearTypeLst!: BaseInfo[];
  selectedYearTypeId = 0;
  reportParentLst!: Company[];

  constructor(private httpService: HttpService, private rd: Renderer2) {}

  ngOnInit(): void {
    this.getMySubCompanies(0);
    const lbl = ['سود', 'زیان'];
    const val = [1255, 300];
    this.createDoughnutChart(lbl, val);
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
        if (id === 0) {
          this.mySubCompanies = mySubCompanies;
          this.selectedHoldingId = mySubCompanies[0].id;
          this.selectCoItem(mySubCompanies[0].id);
          this.getReportType();
        } else this.subCos = mySubCompanies;
      });
  }

  onSelectCompany(company: Company) {
    this.selectedHoldingId = company.id;
    this.selectCoItem(company.id);
    this.getReportChart();
    if (company.id !== 5) this.getMySubCompanies(company.id);
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
    this.getCoInfo(id);
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
      financialYearTypeId: this.selectedYearTypeId,
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
    this.getReportParentCo();
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
        this.getYearType();
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
    // if (!this.selectedHoldingId) this.selectCoItem(this.mySubCompanies[0].id);
  }

  getYearType() {
    this.httpService
      .get<BaseInfo[]>(UrlBuilder.build(BaseInfo.apiAddressYearTypet, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return new Array<BaseInfo>();
        })
      )
      .subscribe(yearType => {
        this.yearTypeLst = yearType;
        this.selectedYearTypeId = yearType[0].id;
        this.selectYearType();
        this.getReportChart();
      });
  }

  selectYearType() {
    this.yearTypeLst.forEach(element => {
      if (element.isSelected) element.isSelected = false;
      if (element.id === this.selectedYearTypeId) element.isSelected = true;
    });
  }

  onYearType(id: number) {
    this.selectedYearTypeId = id;
    this.selectYearType();
    this.getReportChart();
  }

  getReportParentCo() {
    const body = {
      reportId: this.selectedReportTypeId,
      financialYearTypeId: this.selectedYearTypeId,
    };
    this.httpService
      .post<Company[]>(
        UrlBuilder.build(Company.apiAddressReportParentCo, ''),
        body
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return new Array<Company>();
        })
      )
      .subscribe(reportParent => {
        this.reportParentLst = reportParent;
        this.mySubCompanies.forEach(element => {
          const fltr = reportParent.filter(x => x.companyId === element.id);
          if (fltr.length > 0) element.count = fltr[0].count;
        });
      });
  }

  onSelectSubCo(id: number) {
    this.getCoInfo(id);
    this.subCos.forEach(element => {
      element.isSelected = false;
    });
    const selectedItem = this.subCos.filter(x => x.id === id);
    if (selectedItem.length > 0) selectedItem[0].isSelected = true;
  }

  createDoughnutChart(labels: any, counts: any) {
    new Chart('DoughnutChart', {
      type: 'doughnut',
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
          legend: {
            labels: {
              font: {
                family: 'Shabnam',
              },
            },
          },
        },
      },
    });
  }
}
