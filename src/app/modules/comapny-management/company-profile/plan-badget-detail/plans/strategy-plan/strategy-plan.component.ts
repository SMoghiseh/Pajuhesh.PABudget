import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { BigGoal, StrategySWOT } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-strategy-plan',
  templateUrl: './strategy-plan.component.html',
  styleUrls: ['./strategy-plan.component.scss'],
})
export class StrategyPlanComponent implements OnInit {
  @Input() inputData: any;
  data: any;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new StrategySWOT();
  pId!: string;
  mode!: string;
  companyId = 0;
  planDetailData: any;
  matrixSelected: any;
  planingTitleSelected = '';
  selectedPlanName = 'استراتژی';

  // dropdown data list
  bigGoalList: any = [];
  getCompanyByPlanIdList: any = [];
  getPlanId!: number;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBigGoalList();
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.getData(this.companyId);
    // this.getCompanyByPlanId(this.companyId);
  }

  getBigGoalList() {
    this.httpService
      .post<BigGoal[]>(BigGoal.apiAddress + 'List', { withOutPagination: true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }

  getData(id: number) {
    const url = StrategySWOT.apiAddressStrategySwot + 'List/Company/' + id;
    this.httpService
      .get<StrategySWOT[]>(url)

      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new StrategySWOT()];
        })
      )
      .subscribe(res => {
        this.planDetailData = res;
      });
  }

  addPlan(item: any) {
    this.modalTitle = 'ثبت استراتژی ';
    this.mode = 'insert';
    this.addEditData['strategyTypeCodeId'] = item.strategyTypeId;
    this.isOpenAddEditPlan = true;
  }

  editRowDescription(row: any, column: any) {
    this.modalTitle =
      'جزئیات ' + '"' + row.title?.substring(0, 40) + ' ... ' + '"';
    this.addEditData['id'] = row.id;
    this.addEditData['companyId'] = this.companyId;
    this.addEditData['strategyTypeCodeId'] = column.strategyTypeId;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  // getCompanyByPlanId(id: number) {
  //   this.httpService
  //     .get<BigGoal[]>(BigGoal.apiAddressGetComPlanId + id)
  //     .subscribe(response => {
  //       if (response.data && response.data.result) {
  //         this.getCompanyByPlanIdList = response.data.result;
  //         this.getPlanId = this.getCompanyByPlanIdList;
  //       }
  //     });
  // }

  reloadData() {
    this.isOpenAddEditPlan = false;
    this.getData(this.companyId);
  }
}
