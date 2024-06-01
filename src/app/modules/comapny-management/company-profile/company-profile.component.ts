import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Company, Dashboard, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  infoLst = new Company();
  myChart!: Chart;
  myChart1!: Chart;
  myChart2!: Chart;
  benefitCost: any;
  coId: any;
  selectedYearTypeId = 0;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.coId = params['id'];
      this.getProfileCoInfo(this.coId);
      this.getCashBudgetByMonth(this.coId);
      this.getShareholdersDashboard(this.coId);
      this.getCostAndBenefitForProfile(this.coId);
    });
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
    this.selectedYearTypeId = id;
    this.selectYearType();
  }

  selectYearType() {
    // this.yearTypeLst.forEach(element => {
    //   if (element.isSelected) element.isSelected = false;
    //   if (element.id === this.selectedYearTypeId) element.isSelected = true;
    // });
  }

  onCoDetail() {
    this.router.navigate(['/Comapny/companyDetail']);
  }
}
