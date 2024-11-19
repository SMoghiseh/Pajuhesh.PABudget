import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { STRATEGY, Planning, BigGoal, StrategySWOT } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-strategy',
  templateUrl: './add-edit-strategy.component.html',
  styleUrls: ['./add-edit-strategy.component.scss'],
})
export class AddEditStrategyComponent {
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
  get planningId() {
    return this.addEditForm.get('planningId');
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
      planningId: new FormControl(0),
      bigGoalId: new FormControl(0),
      strategyPriority: new FormControl(1),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }


    this.addEditForm.patchValue({
      planningId: Number(this.route.snapshot.paramMap.get('id')),
      strategyTypeCodeId: this.inputData['strategyTypeCodeId']
    });

    this.getPlaningList();
    this.getBigGoalList(this.planningId?.value);
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

  getPlaningList() {
    this.httpService
      .post<Planning[]>(Planning.apiAddress + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.planingList = response.data.result;
        }
      });
  }

  getSwotList() {
    this.httpService
      .post<StrategySWOT[]>(StrategySWOT.apiAddressStrategySwot + 'StrategyType',
        {
          strategyTypeId: this.strategyTypeCodeId?.value,
          planId: this.planningId?.value
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
      .get<BigGoal[]>(BigGoal.apiAddress + 'GetList/' + planId)
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


  validateInput(event: KeyboardEvent) {
    const charCode = event.key;
    const input = (event.target as HTMLInputElement).value;

    // Allow backspace and delete
    if (charCode === 'Backspace' || charCode === 'Delete') {
      return;
    }

    // Prevent entering values starting with '0' unless it’s '0'
    if (input === '' && charCode === '0') {
      event.preventDefault();
    }

    // Prevent values greater than 100
    const newValue = parseInt(input + charCode, 10);
    if (newValue > 10) {
      event.preventDefault();
    }

  }

}
