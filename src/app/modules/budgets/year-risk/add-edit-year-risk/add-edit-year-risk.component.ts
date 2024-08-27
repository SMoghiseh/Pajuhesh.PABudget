import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YearRisk, Company, Period, EvaluateIndex, KeyTypeCode } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'PABudget-add-edit-year-risk',
  templateUrl: './add-edit-year-risk.component.html',
  styleUrls: ['./add-edit-year-risk.component.scss']
})
export class AddEditYearRiskComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  budgetPeriodList: any = [];
  evaluateIndexList: any = [];
  companyList: any = [];
  typeCodeList: any = [];



  inputData = new YearRisk();
  @Input() mode = '';
  @Input() set data1(data: YearRisk) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get title() {
    return this.addEditForm.get('title');
  }

  get yearRiskCode() {
    return this.addEditForm.get('yearRiskCode');
  }

  get budgetPeriodId() {
    return this.addEditForm.get('budgetPeriodId');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get keyTypeCode() {
    return this.addEditForm.get('keyTypeCode');
  }
  get evaluateIndexId() {
    return this.addEditForm.get('evaluateIndexId');
  }




  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getBudgetPeriodList();
    this.getCompanyLst();
    this.getEvaluateIndexLst();
    this.getTypeCodeList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      yearRiskCode: new FormControl('', Validators.required),
      companyId: new FormControl(0, Validators.required),
      evaluateIndexId: new FormControl(0),
      keyTypeCode: new FormControl(0, Validators.required),
      budgetPeriodId: new FormControl(0, Validators.required),
      riskIntensity: new FormControl(0),
      riskLevel: new FormControl(0),
      possibility: new FormControl(0),
      effectBudget: new FormControl(0),
      possimistically: new FormControl(0),
      optimistically: new FormControl(0),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      budgetPeriodId: Number(this.route.snapshot.paramMap.get('id'))
    })

  }

  addEditBudget() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = YearRisk.apiAddress + 'Create';


      this.isLoadingSubmit = true;
      this.httpService
        .post<YearRisk>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'YearRisk',
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

  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getEvaluateIndexLst() {
    this.httpService
      .post<EvaluateIndex[]>(EvaluateIndex.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.evaluateIndexList = response.data.result;
        }
      });
  }

  getTypeCodeList() {
    this.httpService
      .get<KeyTypeCode[]>(KeyTypeCode.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(YearRisk.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
