import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  Dashboard,
  GridBalanceSheet,
  StaticYear,
  UrlBuilder,
} from '@shared/models/response.model';
import { Subscription, map } from 'rxjs';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviousRouteService } from '@shared/services/previous-route.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  infoLst = new Company();
  myChart!: Chart;
  myChart1!: Chart;
  myChart2!: Chart;
  benefitCost: any;
  coId: any;
  staticYearLst = [new StaticYear()];
  selectedYearId!: number;
  gridBalanceLst: Array<GridBalanceSheet> | [] = [];
  selectedProgramName = '';
  gridClass = 'p-datatable-sm';
  dataTableRows = 5;
  loading = false;
  selectedReportId!: number;
  private subscription?: Subscription;
  previousUrl  = '';

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit(): void {
    this.getStaticYear();
    this.route.params.subscribe(params => {
      this.coId = params['id'];
      this.getProfileCoInfo(this.coId);
      this.getCashBudgetByMonth(this.coId);
      this.getShareholdersDashboard(this.coId);
      this.getCostAndBenefitForProfile(this.coId);
    });
    this.subscription = this.previousRouteService.getPreviousUrl().subscribe(url => {debugger
      this.previousUrl = url ? url : '';
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  getProfileCoInfo(id: string) {
    const body = {
      companyId: id,
    };
    this.httpService
      .post<Company[]>(
        UrlBuilder.build(Company.apiAddressDetailCo + 'list', ''),
        body
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new Company()];
        })
      )
      .subscribe(info => {
        this.infoLst = info[0];
      });
  }

  createBarChart(labels: Array<string>, ds: Array<any>, chartName: string) {
    this.myChart = new Chart(chartName, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: ds,
      },
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                family: 'shabnam',
              },
            },
            display: chartName === 'BarChart2' ? false : true,
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
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    if (chartName === 'BarChart') this.myChart1 = this.myChart;
    else this.myChart2 = this.myChart;
  }

  contractRoute() {
    this.router.navigate(['/Comapny/contractCompany', this.coId]),
    {
      queryParams: {},
    };
  }
  getCashBudgetByMonth(id: string) {
    this.httpService
      .get<Dashboard>(
        UrlBuilder.build(
          Dashboard.apiAddressCashBudgetByMonthForProfile + id,
          ''
        )
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
        if (this.myChart1) this.myChart1.destroy();
        this.createBarChart(labels, counts, 'BarChart');
      });
  }

  getShareholdersDashboard(id: string) {
    this.httpService
      .get<Dashboard>(
        UrlBuilder.build(Dashboard.apiAddressShareholdersDashboard + id, '')
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
        if (this.myChart2) this.myChart2.destroy();
        this.createBarChart(labels, counts, 'BarChart2');
      });
  }

  getCostAndBenefitForProfile(id: string) {
    this.httpService
      .get<number>(
        UrlBuilder.build(Dashboard.apiAddressCostAndBenefitForProfile + id, '')
      )
      .pipe(
        map(response => {
          if (response.data) {
            return response.data;
          } else return 0;
        })
      )
      .subscribe(res => {
        this.benefitCost = res;
      });
  }

  onSelectYear(id: number) {
    this.selectedYearId = id;
    this.selectYearType();
    this.getGridBalanceSheet();
  }

  selectYearType() {
    this.staticYearLst.forEach(element => {
      if (element.isSelected) element.isSelected = false;
      if (element.id === this.selectedYearId) element.isSelected = true;
    });
  }

  onCoDetail(id: number) {
    this.router.navigate(['/Comapny/companyDetail/' + id]);
  }

  getStaticYear() {
    this.httpService
      .get<StaticYear[]>(UrlBuilder.build(StaticYear.apiAddress + 'List', ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new StaticYear()];
        })
      )
      .subscribe(res => {
        res.forEach((element, index) => {
          if (index === 0) {
            this.selectedYearId = element.id;
            element.isSelected = true;
          } else element.isSelected = false;
        });
        this.staticYearLst = res;
      });
  }

  onSelectPrograms(id: number, pName: string) {
    this.selectedProgramName = pName;
    this.selectedReportId = id;
    this.getGridBalanceSheet();
  }

  getGridBalanceSheet() {
    this.loading = true;
    const body = {
      companyId: this.coId,
      yearId: this.selectedYearId,
      reportTypeId: this.selectedReportId,
    };
    this.httpService
      .post<GridBalanceSheet[]>(
        UrlBuilder.build(GridBalanceSheet.apiAddress + 'list', ''),
        body
      )
      .pipe(
        map(response => {
          this.loading = false;
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.gridBalanceLst = res;
      });
  }
}
