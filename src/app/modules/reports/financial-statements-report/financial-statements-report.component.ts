import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  FinancialStatementsReport,
} from '@shared/models/response.model';
import { LazyLoadEvent } from 'primeng/api';
import { map, reduce } from 'rxjs';

@Component({
  selector: 'PABudget-financial-statements-report',
  templateUrl: './financial-statements-report.component.html',
  styleUrls: ['./financial-statements-report.component.scss'],
})
export class FinancialStatementsReportComponent implements OnInit {
  financialStatementsReportForm!: FormGroup;
  dataTableRows = 15;
  gridClass = 'p-datatable-sm';
  totalCount!: number;
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  companyList: Company[] = [];
  selectedCompany: any = {};
  selectedRow = new FinancialStatementsReport();
  financialStatementsReportsTable: FinancialStatementsReport[] = [];
  cols: any = [];
  isMinus = true;
  isPositive = true;
  resultValue: any = [];
  // tableData = { this.financialStatementsHeader, this.financialStatementsDetails };

  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    this.getCompanyLst();
    this.financialStatementsReportForm = new FormGroup({
      companyId: new FormControl(null),
    });
  }

  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
  onCompanySelected(e: any) {
    this.getFinancialStatementsReport(e.value);
  }
  getFinancialStatementsReport(companyId: any) {
    this.httpService
      .get<any>(FinancialStatementsReport.apiAddress + companyId)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return {};
        })
      )
      .subscribe(result => {
        this.financialStatementsReportsTable =
          result.financialStatementsReports;
        this.cols = result.headers;
      });
  }
  minusAmount(amount: any) {
    debugger;
    if (amount < 0) {
      const removeMinus = Math.abs(amount);
      const getAmount = '(' + removeMinus + ')';
      console.log(getAmount);
      return getAmount;
    } else return amount;
  }
}
