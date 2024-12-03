import { Component } from '@angular/core';
import {
  BigGoal,
  StrategySWOT,
  Planning,
  UrlBuilder,
  STRATEGY,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss'],
  providers: [ConfirmationService],
})
export class StrategyComponent {
  data: any;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new StrategySWOT();
  pId!: string;
  mode!: string;
  planningId = 0;
  companyId!: number;
  planDetailData: any;
  matrixSelected: any;
  planingTitleSelected = '';

  // dropdown data list
  bigGoalList: any = [];
  getCompanyByPlanIdList: any = [];
  getPlanId!: number;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getBigGoalList();
    this.planningId = Number(this.route.snapshot.paramMap.get('id'));
    this.getData(this.planningId);
    // this.getCompanyByPlanId(this.planningId);
    this.getPlaningList();
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

  getPlaningList() {
    this.httpService
      .post<Planning[]>(Planning.apiAddress + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          let planingList = response.data.result;
          let planingTitleSelected = planingList.find(
            (item: { id: any }) => item.id == this.planningId
          )?.title;
          this.planingTitleSelected = planingTitleSelected
            ? planingTitleSelected
            : '';
        }
      });
  }

  getData(id: number) {
    const url = StrategySWOT.apiAddressStrategySwot + 'List/' + id;
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
    // this.addEditData.companyId = this.companyId;
    this.addEditData['strategyTypeCodeId'] = item.strategyTypeId;
    this.isOpenAddEditPlan = true;
  }

  editRowDescription(row: any, column: any) {
    this.modalTitle =
      'ویرایش ' + '"' + row.title?.substring(0, 40) + ' ... ' + '"';
    // this.addEditData = data;
    this.addEditData['id'] = row.id;
    this.addEditData['strategyTypeCodeId'] = column.strategyTypeId;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: STRATEGY) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.title.substring(0, 40) + ' ...'}" اطمینان دارید؟`,
        header: `عنوان "${item.title.substring(0, 40) + ' ...'}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteItem(item.id, item.title),
      });
  }

  deleteItem(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<STRATEGY>(
          UrlBuilder.build(STRATEGY.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'strategy',
              life: 8000,
              severity: 'success',
              summary: 'با موفقیت حذف شد',
            });
            this.getData(this.planningId);
          }
        });
    }
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
    this.getData(this.planningId);
  }
}
