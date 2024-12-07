import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { STRATEGY, BigGoal, StrategySWOT } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-detail-strategy-plan',
  templateUrl: './detail-strategy-plan.component.html',
  styleUrls: ['./detail-strategy-plan.component.scss'],
})
export class DetailStrategyPlanComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  selectedCheckbox = [];

  // dropdown data list
  planingList: any = [];
  typeCodeList: any = [];
  bigGoalList: any = [];
  swotList: any = [];

  // inputData = new STRATEGY();
  inputData: any;
  @Input() mode = '';
  @Input() set data1(data: any) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get title() {
    return this.addEditForm.get('title');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get bigGoalId() {
    return this.addEditForm.get('bigGoalId');
  }

  get strategyPriority() {
    return this.addEditForm.get('strategyPriority');
  }
  get strategyTypeCodeId() {
    return this.addEditForm.get('strategyTypeCodeId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.addEditForm = new FormGroup({
      strategyTypeCodeId: new FormControl(0),
      title: new FormControl(''),
      companyId: new FormControl(0),
      bigGoalId: new FormControl(),
      strategyPriority: new FormControl(0),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }


    this.addEditForm.patchValue({
      companyId: this.inputData['companyId'],
      strategyTypeCodeId: this.inputData['strategyTypeCodeId']
    });

    this.getBigGoalList(this.companyId?.value);
    this.getSwotList();



  }

  addEditPlan() {

    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData?.strategy?.id;
      const url = StrategySWOT.apiAddressStrategySwot + 'Create';
      request['swot'] = this.selectedCheckbox;
      this.isLoadingSubmit = true;
      this.httpService
        .post<StrategySWOT>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'strategy',
              life: 8000,
              severity: 'success',
              detail: ` عنوان  ${request.title}`,
              summary:
                this.mode === 'insert'
                  ? 'با موفقیت درج شد'
                  : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }

  getSwotList() {
    this.httpService
      .post<StrategySWOT[]>(StrategySWOT.apiAddressStrategySwot + 'StrategyType/Company',
        {
          strategyTypeId: this.strategyTypeCodeId?.value,
          companyId: this.companyId?.value
        }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.swotList = response.data.result;
        }
      });
  }


  getBigGoalList(planId: number) {   
    this.httpService
      .get<BigGoal[]>(BigGoal.apiAddress + 'GetListCompany/' + planId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(STRATEGY.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result['strategy']);

          this.selectedCheckbox = response.data.result['swot']
        }
      });
  }

}
