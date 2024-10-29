import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, Profile, UrlBuilder } from '@shared/models/response.model';
import { Chart } from 'chart.js';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  @Input() inputData: any;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  planDetailData: any;
  selectDateType = 'single';
  first = 0;
  createPieChart: any;
  cols: any = [];
  tableData: any = [];
  employeeInfoList: any;
  selectedEmployeeInfo: any;
  ShareHolderCompanyDashPieLst: any = [];
  afdLst: any = [];
  selectedYerId: any;
  totalCount!: number;
  loading = false;
  viewMode: 'table' | 'chart' | 'treeTable' = 'table';
  selectedPlanName = 'کارکنان ';

  ngOnInit(): void {
    this.getEmployeeFilter();
  }
  constructor(private httpService: HttpService) {}

  getEmployeeFilter() {
    this.httpService
      .get<any>(UrlBuilder.build(Profile.apiAddressEmployeeFilter, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        res.forEach((element: any) => {
          if (element.code === '1') element.isSelected = true;
          else element.isSelected = false;
        });
        this.employeeInfoList = res;
        this.selectedEmployeeInfo = '1';
        this.getEmployeeDataTable(this.selectedEmployeeInfo);
        this.getEmployeeInInfoPieChart(this.selectedEmployeeInfo);
      });
  }

  getEmployeeDataTable(code: string) {
    const body = {
      companyId: this.inputData.companyId,
      typeCode: code,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressEmployeeTable, ''), body)
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

  onSelectemployeeInfo(code: string) {
    this.selectedEmployeeInfo = code;
    this.employeeInfoList.forEach((element: any) => {
      if (element.code === code) element.isSelected = true;
      else element.isSelected = false;
    });
    this.getEmployeeDataTable(code);
    this.getEmployeeInInfoPieChart(code);
  }

  getEmployeeInInfoPieChart(code: string) {
    const body = {
      companyId: this.inputData.companyId,
      typeCode: code,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressEmployeesPie, ''), body)
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
              text: 'کارکنان',
              font: {
                family: 'vazirmatn',
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
                  family: 'vazirmatn',
                  size: 11,
                },
              },
            },
            tooltip: {
              titleFont: {
                family: 'vazirmatn',
              },
              bodyFont: {
                family: 'vazirmatn',
              },
            },
          },
        },
      });
    }
  }
}
