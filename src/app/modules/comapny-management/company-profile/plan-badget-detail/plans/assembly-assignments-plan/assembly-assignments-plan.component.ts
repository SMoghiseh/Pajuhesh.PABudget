import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Pagination, Plan, UrlBuilder } from '@shared/models/response.model';
import { LazyLoadEvent } from 'primeng/api';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-assembly-assignments-plan',
  templateUrl: './assembly-assignments-plan.component.html',
  styleUrls: ['./assembly-assignments-plan.component.scss'],
})
export class AssemblyAssignmentsPlanComponent implements OnInit {
  @Input() inputData: any;
  gridClass = 'p-datatable-sm';

  dataTableRows = 10;
  first = 0;
  totalCount!: number;
  planDetailData: any;
  // data: Plan[] = [];
  loading = false;
  yearId: any;
  assemblyAssignmentsClass = 'p-datatable-sm';
  assemblyAssignmentsTotalCount!: number;
  selectDateType = 'single';
  selectedPlanName = ' تکالیف مجمع';
  modalTitle = '';
  isOpenDataList = false;
  assemblyAssignmentsDataList: any;
  assemblyAssignmentsDataTableRows = 10;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

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
      .post<any>(UrlBuilder.build(Plan.apiAddressYearUnion, ''), body)
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

  showAssemblyAssignmentsList(data: any) {
    this.modalTitle =
      ' مفاد تکالیف' + ' " ' + data?.titleMain?.substring(0, 40) + ' " ';
    this.isOpenDataList = true;
    this.assemblyAssignmentsDataList = data.titleList;
  }
  closeModal() {
    this.isOpenDataList = false;
  }

  loadData(event?: any) {
    this.getPlanDetail(event);
  }
  returnSelectedDate(e?: any) {
    this.yearId = e;
    if (this.yearId) this.getPlanDetail();
  }
}
