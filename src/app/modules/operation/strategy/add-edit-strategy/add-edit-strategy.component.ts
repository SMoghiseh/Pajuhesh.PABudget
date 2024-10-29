import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { STRATEGY, Planning, BigGoal } from '@shared/models/response.model';
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

  // dropdown data list
  planingList: any = [];
  typeCodeList: any = [];
  bigGoalList: any = [];

  inputData = new STRATEGY();
  @Input() mode = '';
  @Input() planId = 0;
  @Input() set data1(data: STRATEGY) {
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

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getPlaningList();
    this.getBigGoalList(this.planId);

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      planningId: new FormControl('', Validators.required),
      bigGoalId: new FormControl(''),
      strategyPriority: new FormControl('', Validators.required),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      planningId: Number(this.route.snapshot.paramMap.get('id')),
    });
  }

  addEditPlan() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = STRATEGY.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<STRATEGY>(url, request)
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

  getBigGoalList(planId: number) {
    const body = {
      withOutPagination: true,
      companyId: planId,
    };
    this.httpService
      .post<BigGoal[]>(BigGoal.apiAddress + 'List', body)
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
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
