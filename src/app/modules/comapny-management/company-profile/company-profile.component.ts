import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  Dashboard,
  GridBalanceSheet,
  Profile,
  StaticYear,
  UrlBuilder,
} from '@shared/models/response.model';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  selectedRows: any;
  liveSelectionRow = 0;
  planLst!: Profile[];
  budgetLst!: Profile[];
  selectedYears: Array<number> = [];
  planDetailData: any;
  budgetDetailData: any;
  selectedPlanId!: number;
  selectedBudgetId!: number;

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
    this.getBudget();
    this.getPlan();
    this.getStaticYear();
    this.route.params.subscribe(params => {
      this.coId = params['id'];
      this.getProfileCoInfo(this.coId);
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

  onSelectYear(id: number) {
    this.selectYearType(id);
    // this.getGridBalanceSheet();
  }

  selectYearType(id: number) {
    const fltr = this.selectedYears.filter(x => x === id);
    this.staticYearLst.forEach(element => {
      if (element.id === id) {
        if (fltr.length === 0) {
          element.isSelected = true;
          this.selectedYears.push(element.id);
        } else {
          element.isSelected = false;
          const index = this.selectedYears.indexOf(element.id);
          if (index > -1) this.selectedYears.splice(index, 1);
        }
      }
    });
    if (this.selectedPlanId !== -1) this.onSelectPlan(this.selectedPlanId);
    if (this.selectedBudgetId !== -1)
      this.onSelectBudget(this.selectedBudgetId);
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
            this.selectedYears.push(element.id);
            element.isSelected = true;
          } else element.isSelected = false;
        });
        this.staticYearLst = res;
      });
  }

  // getGridBalanceSheet() {
  //   this.loading = true;
  //   const body = {
  //     companyId: this.coId,
  //     yearId: this.selectedYears,
  //     reportTypeId: this.selectedReportId,
  //   };
  //   this.httpService
  //     .post<GridBalanceSheet[]>(
  //       UrlBuilder.build(GridBalanceSheet.apiAddress + 'list', ''),
  //       body
  //     )
  //     .pipe(
  //       map(response => {
  //         this.loading = false;
  //         if (response.data && response.data.result) {
  //           return response.data.result;
  //         } else return [];
  //       })
  //     )
  //     .subscribe(res => {
  //       this.gridBalanceLst = res;
  //     });
  // }

  onRowSelect(e: any) {
    this.liveSelectionRow++;
  }

  onRowUnselect(e: any) {
    this.liveSelectionRow--;
  }

  getPlan() {
    this.httpService
      .get<Profile[]>(UrlBuilder.build(Profile.apiAddressGetPlan, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new Profile()];
        })
      )
      .subscribe(res => {
        this.planLst = res;
      });
  }

  getBudget() {
    this.httpService
      .get<Profile[]>(UrlBuilder.build(Profile.apiAddressGetBudget, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new Profile()];
        })
      )
      .subscribe(res => {
        this.budgetLst = res;
      });
  }

  onSelectPlan(id: number) {
    this.selectedPlanId = id;
    this.selectedBudgetId = -1;
    const body = {
      companyId: this.coId,
      staticYearId: this.selectedYears[this.selectedYears.length - 1],
      planId: id,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Profile.apiAddressGetPlanDetail, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.planDetailData = res;
      });
  }

  onSelectBudget(id: number) {
    this.selectedBudgetId = id;
    this.selectedPlanId = -1;
    const body = {
      companyId: this.coId,
      staticYearId: this.selectedYears[this.selectedYears.length - 1],
      budgetId: id,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Profile.apiAddressGetBudgetDetail, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.planDetailData = res;
      });
  }
}
