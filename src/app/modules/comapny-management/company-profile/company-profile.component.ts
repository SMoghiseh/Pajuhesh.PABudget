import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  Dashboard,
  GridBalanceSheet,
  PermissionProfile,
  Profile,
  StaticYear,
  UrlBuilder,
} from '@shared/models/response.model';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  infoLst = new Company();
  benefitCost: any;
  coId: any;
  staticYearLst = [new StaticYear()];
  gridBalanceLst: Array<GridBalanceSheet> | [] = [];
  selectedProgramName = '';
  gridClass = 'p-datatable-sm';
  dataTableRows = 5;
  loading = false;
  selectedReportId!: number;
  selectedRows: any = [];
  liveSelectionRow = 0;
  // planLst!: Profile[];
  // budgetLst!: Profile[];
  allList: any = [];
  budgetList: any = [];
  budgetList_all: any = [];
  yearlyPlanList: any = [];
  yearlyPlanList_all: any = [];
  macroList: any = [];
  macroList_all: any = [];
  selectedYears: any;
  planDetailData: any;
  budgetDetailData: any;
  selectedYearlyPlanId!: number;
  selectedMacroId!: number;
  selectedBudgetId!: number;
  isSelectBudget = false;
  isSelectPlan = false;
  isShowChart = false;
  lineChart1: any;
  selectDateType = 'single';
  tableYearSelectedId: any;
  _tableYearSelectedId: any;
  switchPlan = '';
  switchItem = '';
  planInputData: any;

  products = [
    {
      category: 'Accessories',
      code: {
        color: 'green',
        id: 'f230fh0g3',
      },
      description: 'Product Description',
      id: '1000',
      image: 'bamboo-watch.jpg',
      inventoryStatus: 'INSTOCK',
      name: {
        id: 'Bamboo Watch',
        color: null,
      },
      price: 65,
      quantity: 24,
      rating: 5,
      color: 'green',
    },
    {
      category: 'Accessories',
      code: {
        color: 'red',
        id: 'f230fh0g3',
      },
      description: 'Product Description',
      id: '1000',
      image: 'bamboo-watch.jpg',
      inventoryStatus: 'INSTOCK',
      name: 'Bamboo Watch',
      price: 65,
      quantity: 24,
      rating: 5,
      color: 'red',
    },
  ];

  cols = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'quantity', header: 'Quantity' },
  ];

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
    this.route.params.subscribe(params => {
      this.coId = params['id'];
      this.getProfileCoInfo(this.coId);
      this.getCostAndBenefitForProfile(this.coId);
      this.planInputData = {
        companyId: Number(this.coId),
      };
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

  contractRoute() {
    this.router.navigate(['/Comapny/contractCompany', this.coId]),
      {
        queryParams: {},
      };
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

  onCoDetail(id: number) {
    this.router.navigate(['/Comapny/companyDetail/' + id]);
  }

  onRowSelect(e: any) {
    this.liveSelectionRow++;
  }

  onRowUnselect(e: any) {
    this.liveSelectionRow--;
  }

  getList() {
    this.httpService
      .get<PermissionProfile[]>(
        UrlBuilder.build(PermissionProfile.apiAddress + 'list', '')
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new PermissionProfile()];
        })
      )
      .subscribe(res => {
        this.operationOnList(res);
      });
  }

  operationOnList(data: any) {
    this.allList = data;
    data.forEach((list: any) => {
      list['groupedDetail'] = this.convertArray(list.detail);
    });
  }

  convertArray(data: any) {
    const grouped = data.reduce((result: any, currentValue: any) => {
      (result[currentValue['group']] =
        result[currentValue['group']] || []).push(currentValue);
      return result;
    }, []);
    return grouped;
  }

  onSelectBudget(data: any) {
    this.switchItem = data.componentName;
    this.selectedBudgetId = data.id;
    let yearId = 12;
    if (this.selectedYears) {
      if (typeof this.selectedYears === 'number') yearId = this.selectedYears;
      else yearId = this.selectedYears[0];
    }
  }

  selectTable() {
    this.selectDateType = 'single';
    this.isShowChart = false;
    this.tableYearSelectedId = this._tableYearSelectedId;
    this.selectedRows = [];
  }

  getChart() {
    this.selectDateType = 'multiple';
    this.isShowChart = true;
    const type = typeof this.selectedYears;
    let arr = [];
    if (type === 'number') arr.push(this.selectedYears);
    else arr = this.selectedYears;
    this._tableYearSelectedId = this.selectedYears;
    const body = {
      companyId: this.coId,
      reportTypeId: this.selectedRows,
      yearId: arr,
    };
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
        if (this.lineChart1) this.lineChart1.destroy();
        this.createLineChart(res);
      });
  }

  createLineChart(data: any) {
    this.lineChart1 = new Chart('LineChart', {
      type: 'line',
      data: data,
      options: {
        plugins: {
          legend: {
            labels: {
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
  }
}
