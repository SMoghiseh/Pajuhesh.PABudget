import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YearActivity, ManagerType, Period, YearGoal, Operating } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-year-activity',
  templateUrl: './add-edit-year-activity.component.html',
  styleUrls: ['./add-edit-year-activity.component.scss']
})
export class AddEditYearActivityComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  budgetPeriodList: any = [];
  periodDetailList: any = [];
  yearGoalList: any = [];
  rollList: any = [];
  operationList: any = [];
  weightCodeList: any = [];
  priorityCodeList: any = [];
  costCenterList: any = [];




  inputData = new YearActivity();
  @Input() mode = '';
  @Input() set data1(data: YearActivity) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get yearGoalId() {
    return this.addEditForm.get('yearGoalId');
  }
  get fromPeriodDetailId() {
    return this.addEditForm.get('fromPeriodDetailId');
  }
  get toPeriodDetailId() {
    return this.addEditForm.get('toPeriodDetailId');
  }
  get rollId() {
    return this.addEditForm.get('rollId');
  }
  get operatingId() {
    return this.addEditForm.get('operatingId');
  }
  get weightCode() {
    return this.addEditForm.get('weightCode');
  }
  get priorityCode() {
    return this.addEditForm.get('priorityCode');
  }
  get code() {
    return this.addEditForm.get('code');
  }
  get title() {
    return this.addEditForm.get('title');
  }
  get description() {
    return this.addEditForm.get('description');
  }
  get priceCu() {
    return this.addEditForm.get('priceCu');
  }
  get costCenterId() {
    return this.addEditForm.get('costCenterId');
  }



  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getBudgetPeriodList();
    this.getYearGoalList();
    this.getManagerTypeList();
    this.getOperationList();
    this.getWeightCodeList();
    this.getPriorityCodeList();
    this.getCostCenterList();

    this.addEditForm = new FormGroup({
      budgetPeriodId: new FormControl(''),
      yearGoalId: new FormControl(''),
      fromPeriodDetailId: new FormControl('', Validators.required),
      toPeriodDetailId: new FormControl('', Validators.required),
      rollId: new FormControl('', Validators.required),
      operatingId: new FormControl(0),
      weightCode: new FormControl('', Validators.required),
      priorityCode: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priceCu: new FormControl('', Validators.required),
      costCenterId: new FormControl('', Validators.required)

    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      budgetPeriodId: Number(this.route.snapshot.paramMap.get('budgetPeriodId')),
      yearGoalId: Number(this.route.snapshot.paramMap.get('yearGoalId'))
    })

    this.getPeriodDetailList(Number(this.route.snapshot.paramMap.get('budgetPeriodId')));

  }

  addEditBudget() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = this.mode === 'insert'
        ? YearActivity.apiAddress + 'Create'
        : YearActivity.apiAddress + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<YearActivity>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'YearActivity',
              life: 8000,
              severity: 'success',
              detail: ` عنوان  ${request.title}`,
              summary: this.mode === 'insert'
                ? 'با موفقیت درج شد'
                : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }

  getBudgetPeriodList() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
  }

  getPeriodDetailList(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailList = response.data.result;
        }
      });
  }

  getYearGoalList() {
    this.httpService
      .post<YearGoal[]>(YearGoal.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.yearGoalList = response.data.result;
        }
      });
  }

  getManagerTypeList() {
    this.httpService
      .get<ManagerType[]>(ManagerType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.rollList = response.data.result;
        }
      });
  }
  getOperationList() {
    this.httpService
      .post<Operating[]>(Operating.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.operationList = response.data.result;
        }
      });
  }

  getWeightCodeList() {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressWeight + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.weightCodeList = response.data.result;
        }
      });
  }

  getPriorityCodeList() {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressPriority + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.priorityCodeList = response.data.result;
        }
      });
  }
  getCostCenterList() {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressCostCenter + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.costCenterList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(YearActivity.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }

}
