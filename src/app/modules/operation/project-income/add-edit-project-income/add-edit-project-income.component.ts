import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { Period, Project, ProjectIncome } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-project-income',
  templateUrl: './add-edit-project-income.component.html',
  styleUrls: ['./add-edit-project-income.component.scss'],
})
export class AddEditProjectIncomeComponent {
  addEditForm!: FormGroup;

  inputData = new ProjectIncome();
  budgetPeriodList: any = [];
  periodDetailList: any = [];
  OperationPeriodList: any = [];
  unitList: any = [];
  sourceTypeList: any = [];
  isLoadingSubmit = false;
  addEditFormSubmitted = false;
  @Input() mode = '';
  @Input() set data(data: ProjectIncome) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getBudgetPeriodLst();
    this.getunitList();
    this.getProjectSourceTypeList();
    this.addEditForm = new FormGroup({
      periodId: new FormControl(null),
      periodDetailId: new FormControl(null),
      projectId: new FormControl(null),
      unitId: new FormControl(null),
      sourceType: new FormControl(null),
      percentGrow: new FormControl(null),
      estimatePriceCu: new FormControl(null),
      realPriceCu: new FormControl(null),
    });

    this.route.params.subscribe(params => {
      const RouteId = params['id'];
      this.addEditForm.patchValue({ projectId: parseInt(RouteId) });
    });

    if (this.mode === 'edit') {
      this.getOperationPeriodLst(this.inputData.periodId);
      this.addEditForm.patchValue(this.inputData);
    }
  }

  getBudgetPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
  }

  onChangBudgetPeriod(e: any) {
    this.getOperationPeriodLst(e.value);
  }

  getOperationPeriodLst(id: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown' + `/${id}`)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.OperationPeriodList = response.data.result;
        }
      });
  }

  getunitList() {
    this.httpService
      .post<Period[]>(Period.apiAddressUnits + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.unitList = response.data.result;
        }
      });
  }

  getProjectSourceTypeList() {
    this.httpService
      .get<Project[]>(Project.apiAddressSourceType + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.sourceTypeList = response.data.result;
        }
      });
  }
  addEditProjectIncome() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;

      // const url = ProjectIncome.apiAddress + 'Create';
      const url =
        this.mode === 'insert'
          ? ProjectIncome.apiAddress + 'Create'
          : ProjectIncome.apiAddress + 'Update';
      this.isLoadingSubmit = true;

      this.httpService
        .post<ProjectIncome>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'projectIncome',
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
}
