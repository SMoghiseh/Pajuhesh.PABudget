import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  YearActivity,
  ManagerType,
  Period,
  YearGoal,
  Operating,
  ReferenceType,
  ReferenceList,
  Company,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-year-activity',
  templateUrl: './add-edit-year-activity.component.html',
  styleUrls: ['./add-edit-year-activity.component.scss'],
})
export class AddEditYearActivityComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  dropDwnDis = true;
  // dropdown data list
  budgetPeriodList: any = [];
  periodDetailList: any = [];
  referenceList: any = [];
  referenceOnList: any = [];
  rollList: any = [];
  operationList: any = [];
  weightCodeList: any = [];
  priorityCodeList: any = [];
  costCenterList: any = [];
  companyList: any[] = [];

  inputData = new YearActivity();
  @Input() mode = '';
  @Input() set data1(data: YearActivity) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get referenceCode() {
    return this.addEditForm.get('referenceCode');
  }
  get referenceId() {
    return this.addEditForm.get('referenceId');
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
  get projectId() {
    return this.addEditForm.get('projectId');
  }
  get weightCode() {
    return this.addEditForm.get('weightCode');
  }
  get priorityCode() {
    return this.addEditForm.get('priorityCode');
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
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get periodId() {
    return this.addEditForm.get('periodId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getReferenceList();
    this.getManagerTypeList();
    this.getOperationList();
    this.getWeightCodeList();
    this.getPriorityCodeList();
    this.getCostCenterList();
    this.getCompanyLst();

    this.addEditForm = new FormGroup({
      periodId: new FormControl(
        // { value: null, disabled: true },
        Validators.required
      ),
      companyId: new FormControl(null, Validators.required),
      referenceCode: new FormControl(
        // { value: null, disabled: true },
        Validators.required
      ),
      referenceId: new FormControl(
        // { value: null, disabled: true },
        Validators.required
      ),
      fromPeriodDetailId: new FormControl(
        // { value: null, disabled: true },
        Validators.required
      ),
      toPeriodDetailId: new FormControl(
        // { value: null, disabled: true },
        Validators.required
      ),
      rollId: new FormControl('', Validators.required),
      projectId: new FormControl(0),
      weightCode: new FormControl('', Validators.required),
      priorityCode: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priceCu: new FormControl('', Validators.required),
      costCenterId: new FormControl('', Validators.required),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      // periodId: Number(this.route.snapshot.paramMap.get('periodId')),
      // yearGoalId: Number(this.route.snapshot.paramMap.get('yearGoalId'))
    });

    // this.getPeriodDetailList(Number(this.route.snapshot.paramMap.get('periodId')));
  }

  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getReferenceFilteredList() {

    // check if periodId &  referenceCode is selected
    let formValue = this.addEditForm.value;
    if (formValue.periodId & formValue.referenceCode) {
      this.getListByReference();
    }

    // this.getPeriodDetailList(e.value);
    // this.addEditForm.controls['fromPeriodDetailId'].enable();
    // this.addEditForm.controls['toPeriodDetailId'].enable();
    // this.addEditForm.controls['referenceCode'].enable();
  }

  getListByReference() {
    const formValue = this.addEditForm.value;

    const body = {
      referenceCode: formValue.referenceCode,
      periodId: formValue.periodId,
      companyId: formValue.companyId,
    };

    this.httpService
      .post<ReferenceList[]>(ReferenceList.apiAddress, body)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.referenceOnList = response.data.result;
        }
        this.addEditForm.controls['referenceId'].enable();
      });
  }

  addEditBudget() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;

      if(this.mode === 'insert'){
        delete request['id'];
      } 

      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url =
        this.mode === 'insert'
          ? YearActivity.apiAddress + 'Create'
          : YearActivity.apiAddress + 'Update';
      // delete request['companyId'];
      // delete request['periodId'];

      
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

  onChangeCompanyId(e: any) {
    this.getBudgetPeriodList(e.value);
    this.addEditForm.controls['periodId'].enable();
  }

  getBudgetPeriodList(companyId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown/' + companyId)
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

  getReferenceList() {
    this.httpService
      .get<ReferenceType[]>(ReferenceType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.referenceList = response.data.result;
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
        withOutPagination: true,
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
