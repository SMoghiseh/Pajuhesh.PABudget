import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YearGoal, Company, BigGoal, Aspect, Period } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-year-goal',
  templateUrl: './add-edit-year-goal.component.html',
  styleUrls: ['./add-edit-year-goal.component.scss'],
})
export class AddEditYearGoalComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  budgetPeriodList: any = [];
  aspectCodeList: any = [];
  companyList: any = [];
  bigGoalList: any = [];

  inputData = new YearGoal();
  @Input() mode = '';
  @Input() set data1(data: YearGoal) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get title() {
    return this.addEditForm.get('title');
  }

  get yearGoalCode() {
    return this.addEditForm.get('yearGoalCode');
  }

  get budgetPeriodId() {
    return this.addEditForm.get('budgetPeriodId');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get bigGoalId() {
    return this.addEditForm.get('bigGoalId');
  }
  get aspectCode() {
    return this.addEditForm.get('aspectCode');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void { debugger

    this.getBudgetPeriodList();
    this.getAspectCodeLst();
    this.getCompanyLst();
    this.getBigGoalList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      yearGoalCode: new FormControl('', Validators.required),
      companyId: new FormControl(0, Validators.required),
      bigGoalId: new FormControl(0, Validators.required),
      budgetPeriodId: new FormControl(0, Validators.required),
      aspectCode: new FormControl(0)
    });

    if (this.mode === 'edit') { debugger
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      budgetPeriodId: Number(this.route.snapshot.paramMap.get('id'))
    })

  }

  addEditBudget() { debugger
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = YearGoal.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<YearGoal>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'yearGoal',
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

  getBudgetPeriodList() { 
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
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

  getBigGoalList() { debugger
    this.httpService
      .post<BigGoal[]>(BigGoal.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }

  getAspectCodeLst() { debugger
    this.httpService
      .get<Aspect[]>(Aspect.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.aspectCodeList = response.data.result;
        }
      });
  }

  getRowData(id: number) { debugger
    this.httpService
      .get<any>(YearGoal.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
