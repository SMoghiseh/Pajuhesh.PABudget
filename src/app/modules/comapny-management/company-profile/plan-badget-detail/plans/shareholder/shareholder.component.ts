import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-shareholder',
  templateUrl: './shareholder.component.html',
  styleUrls: ['./shareholder.component.scss'],
})
export class ShareholderComponent {
  @Input() inputData: any;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  planDetailData: any;
  selectDateType = 'single';
  first = 0;
  cols: any = [];
  tableData: any = [];
  selectedYerId: any;
  totalCount!: number;
  loading = false;
  viewMode: 'table' | 'chart' | 'treeTable' = 'table';
  selectedPlanName = 'سهامداران ';
  constructor(private httpService: HttpService) {}

  getShareholder(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressShareHolder, ''), body)
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
  returnSelectedDate(e: any) {
    this.selectedYerId = e;
    if (this.viewMode == 'table') this.getShareholder(e);
  }
}
