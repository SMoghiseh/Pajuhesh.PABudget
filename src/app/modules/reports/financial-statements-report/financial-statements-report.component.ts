import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  Company,
  FinancialStatementsReport,
} from '@shared/models/response.model';
import { LazyLoadEvent } from 'primeng/api';
import { map } from 'rxjs';

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
  financialStatementsReport: any;
  financialStatementsHeader: FinancialStatementsReport[] = [];
  financialStatementsDetails: FinancialStatementsReport[] = [];
  resultValue: any = [];
  // tableData = { this.financialStatementsHeader, this.financialStatementsDetails };

  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    debugger;
    this.getCompanyLst();
    this.financialStatementsReportForm = new FormGroup({
      companyId: new FormControl(null),
    });
  }

  getCompanyLst() {
    debugger;
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
    debugger;
    // this.selectedCompany = event?.value;
    this.getFinancialStatementsReport(e.value);
  }
  getFinancialStatementsReport(companyId: any) {
    debugger;
    this.httpService
      .get<any>(FinancialStatementsReport.apiAddress + companyId)
      .pipe(
        map(response => {
          debugger;
          if (response.data && response.data.result) {
            return response.data.result;
          } else return {};
        })
      )
      .subscribe(result => {
        this.financialStatementsHeader = result;
        // for (let i = 0; i < result.length; i++) {
        //   this.resultValue = result[i];
        //   this.financialStatementsDetails = this.resultValue.value[i];
        // }
      });
  }
}
