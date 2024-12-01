import { Component, Input } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Pagination, Plan, UrlBuilder } from '@shared/models/response.model';
import { LazyLoadEvent } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
})
export class OrientationComponent {
  @Input() inputData: any;
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  first = 0;
  totalCount!: number;
  planDetailData: any;
  // data: Plan[] = [];
  loading = false;
  modalTitle = '';
  isOpenDataList = false;
  dataList: any;
  yearId: any;
  selectDateType = 'single';
  selectedPlanName = '   سیاست ها';

  constructor(private httpService: HttpService) {}

  getPlanDetail(event?: LazyLoadEvent) {
    if (!this.yearId) return;
    const pagination = new Pagination();
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      companyId: this.inputData.companyId,
      periodId: this.yearId,
    };
    this.first = 0;
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressOrientation, ''), body)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Plan()];
        })
      )
      .subscribe(res => (this.planDetailData = res));
  }

  loadData(event?: any) {
    this.getPlanDetail(event);
  }
  returnSelectedDate(e?: any) {
    this.yearId = e;
    if (this.yearId) this.getPlanDetail();
  }
}
