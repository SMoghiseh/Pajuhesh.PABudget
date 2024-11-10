import { Component } from '@angular/core';
import {
  UrlBuilder,
  STRATEGY,
  BigGoal,
  StrategySWOT
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map } from 'rxjs';
import {
  ConfirmationService, MessageService
} from 'primeng/api';
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
  addEditData = new STRATEGY();
  pId!: string;
  mode!: string;
  planningId = 0;
  companyId!: number;
  planDetailData: any;
  matrixSelected: any;

  // dropdown data list
  bigGoalList: any = [];
  getCompanyByPlanIdList: any = [];
  getPlanId!: number;


  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
   
    this.getBigGoalList();
    this.planningId = Number(this.route.snapshot.paramMap.get('id'));
    this.getData(this.planningId);
    this.getCompanyByPlanId(this.planningId);
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

  getData(id:number) {

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

  addPlan() {
    this.modalTitle = 'افزودن استراتژی  ';
    this.mode = 'insert';
    this.addEditData.companyId = this.companyId;
    this.isOpenAddEditPlan = true;
  }

  editRowDescription(data: STRATEGY) {
    this.modalTitle = 'ویرایش ' + '"' + data.title?.substring(0, 40) + ' ... ' + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: STRATEGY) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.title} " اطمینان دارید؟`,
        header: `عنوان "${item.title}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePlan(item.id, item.title),
      });
  }

  getCompanyByPlanId(id: number) {
    this.httpService
      .get<BigGoal[]>(BigGoal.apiAddressGetComPlanId + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.getCompanyByPlanIdList = response.data.result;
          this.getPlanId = this.getCompanyByPlanIdList;
        }
      });
  }
  deletePlan(id: number, title: string) {
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
              detail: ` مورد   ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getData(this.planningId);
          }
        });
    }
  }

  addDetail(item: any) {
    this.isOpenAddEditPlan = true;
    this.matrixSelected = item;
  }

  reloadData() {
    this.isOpenAddEditPlan = false;
    this.getData(this.planningId);
  }

}
