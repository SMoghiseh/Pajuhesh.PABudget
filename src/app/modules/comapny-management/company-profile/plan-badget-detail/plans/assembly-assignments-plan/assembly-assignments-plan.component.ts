import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
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

  getPlanDetail(yearId: number) {
    const body = {
      companyId: this.inputData.companyId,
      periodId: yearId,
    };
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
      'تکالیف مجمع' + ' " ' + data?.titleMain?.substring(0, 40) + ' " ';
    this.isOpenDataList = true;
    this.assemblyAssignmentsDataList = data.titleList;
  }
  closeModal() {
    this.isOpenDataList = false;
  }

  returnSelectedDate(e: any) {
    this.getPlanDetail(e);
  }
}
