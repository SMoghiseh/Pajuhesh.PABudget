import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { Company, Period, Project } from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.scss'],
})
export class AddEditProjectComponent {
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  companyList: any = [];
  budgetPeriodList: any = [];
  fromBudgetPeriodList: any = [];
  toBudgetPeriodList: any = [];
  projectTypeCodeList: any = [];
  inputData = new Project();
  projectDetailLst: Project[] = [];
  @Input() mode = '';
  @Input() set data(data: Project) {
    this.inputData = data;
  }
  @Output() isSuccess = new EventEmitter<boolean>();

  
  get budgetPeriodId() {
    return this.addEditForm.get('budgetPeriodId');
  }
  get fromBudgetPeriodId() {
    return this.addEditForm.get('fromBudgetPeriodId');
  }
  get toBudgetPeriodId() {
    return this.addEditForm.get('toBudgetPeriodId');
  }
  get title() {
    return this.addEditForm.get('title');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get address() {
    return this.addEditForm.get('address');
  }
  get typeCode() {
    return this.addEditForm.get('typeCode');
  }
  get internalRateOfReturn() {
    return this.addEditForm.get('internalRateOfReturn');
  }
  get netPersentValue() {
    return this.addEditForm.get('netPersentValue');
  }
  get payBackPeriod() {
    return this.addEditForm.get('payBackPeriod');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) {}

  ngOnInit(): void {
    this.getCompanyLst();
    this.getprojectTypeCodeLst();
    this.addEditForm = new FormGroup({
      budgetPeriodId: new FormControl(null , Validators.required),
      fromBudgetPeriodId: new FormControl(null , Validators.required),
      toBudgetPeriodId: new FormControl(null , Validators.required),
      title: new FormControl(null , Validators.required),
      companyId: new FormControl(null , Validators.required),
      address: new FormControl(null , Validators.required),
      typeCode: new FormControl(null , Validators.required),
      internalRateOfReturn: new FormControl(null , Validators.required),
      netPersentValue: new FormControl(null , Validators.required),
      payBackPeriod: new FormControl(null , Validators.required),
    });

    if (this.mode === 'edit') {
      this.getfromBudgetPeriodLst(this.inputData.budgetPeriodId);
      this.geToBudgetPeriodLst(this.inputData.budgetPeriodId);
      this.addEditForm.patchValue(this.inputData);
      // this.getfromBudgetPeriodLst(this.inputData.id);
      // this.geToBudgetPeriodLst(this.inputData.id);
    }
  }

  addEditProject() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;

      const url =
        this.mode === 'insert'
          ? Project.apiAddressCreate
          : Project.apiAddressUpdate;
      this.isLoadingSubmit = true;

      this.httpService
        .post<Project>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'Project',
              life: 8000,
              severity: 'success',
              detail: ` برنامه  ${request.title}`,
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

  getRowData(id: number) {}
  onChangBudgetPeriod(e: any) {
    this.geToBudgetPeriodLst(e.value);
    this.getfromBudgetPeriodLst(e.value);
  }
  onChangeCompanyId(e: any) {
    this.getBudgetPeriodLst(e.value);
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
  getBudgetPeriodLst(companyId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown/' + companyId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.budgetPeriodList = response.data.result;
        }
      });
  }

  getfromBudgetPeriodLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown' + `/${periodId}`)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.fromBudgetPeriodList = response.data.result;
          if (this.inputData.id)
            this.addEditForm.patchValue({
              fromBudgetPeriodId: this.inputData.fromBudgetPeriodId,
            });
        }
      });
  }

  geToBudgetPeriodLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown' + `/${periodId}`)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.toBudgetPeriodList = response.data.result;
          if (this.inputData.id)
            this.addEditForm.patchValue({
              fromBudgetPeriodId: this.inputData.fromBudgetPeriodId,
            });
        }
      });
  }
  getprojectTypeCodeLst() {
    this.httpService
      .get<Project[]>(Project.apiAddressProjectTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.projectTypeCodeList = response.data.result;
        }
      });
  }

  onlyNumberKey(event: { charCode: number }) {
    return event.charCode == 8 || event.charCode == 0
    ? null
    : ( event.charCode >= 48 && event.charCode <= 57 );
  }

  onlyFloatNumberKey(event: { charCode: number }) {
    return event.charCode == 8 || event.charCode == 0
    ? null
    : ( event.charCode >= 48 && event.charCode <= 57 )|| event.charCode == 46 ;
  }
}
