import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { Company, BenefitCostsReport } from '@shared/models/response.model';
import { LazyLoadEvent } from 'primeng/api';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-benefit-cost-report',
  templateUrl: './benefit-cost-report.component.html',
  styleUrls: ['./benefit-cost-report.component.scss'],
})
export class BenefitCostReportComponent {
  benefitCostReportForm!: FormGroup;
  dataTableRows = 15;
  gridClass = 'p-datatable-sm';
  totalCount!: number;
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  companyList: Company[] = [];
  selectedCompany: any = {};
  selectedRow = new BenefitCostsReport();
  benefitCostReportsTable: BenefitCostsReport[] = [];
  cols: any = [];
  isMinus = true;
  isPositive = true;
  resultValue: any = [];
  // tableData = { this.benefitCostHeader, this.benefitCostDetails };

  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    this.getCompanyLst();
    this.benefitCostReportForm = new FormGroup({
      companyId: new FormControl(null),
    });
  }

  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
          this.benefitCostReportForm.patchValue({
            companyId: this.companyList[0].id,
          });
          this.getBenefitCostsReport(this.companyList[0].id);
        }
      });
  }
  onCompanySelected(e: any) {
    this.getBenefitCostsReport(e.value);
  }
  getBenefitCostsReport(companyId: any) {
    this.httpService
      .get<any>(BenefitCostsReport.apiAddress + companyId)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return {};
        })
      )
      .subscribe(result => {
        this.benefitCostReportsTable = result.financialStatementsReports;
        this.cols = result.headers;
      });
  }
  minusAmount(amount: any) {
    if (amount < 0) {
      const removeMinus = Math.abs(amount);
      const getAmount = '(' + removeMinus + ')';
      console.log(getAmount);
      return getAmount;
    } else return amount;
  }
}
