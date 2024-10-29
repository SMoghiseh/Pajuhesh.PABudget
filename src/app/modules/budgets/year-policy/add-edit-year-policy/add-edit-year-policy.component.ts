import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YearPolicy, Company, Period, TypeCode } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'PABudget-add-edit-year-policy',
  templateUrl: './add-edit-year-policy.component.html',
  styleUrls: ['./add-edit-year-policy.component.scss']
})
export class AddEditYearPolicyComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  budgetPeriodList: any = [];
  aspectCodeList: any = [];
  companyList: any = [];
  typeCodeList: any = [];



  inputData = new YearPolicy();
  @Input() mode = '';
  @Input() set data1(data: YearPolicy) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get title() {
    return this.addEditForm.get('title');
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




  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getBudgetPeriodList();
    this.getCompanyLst();
    this.getTypeCodeList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      companyId: new FormControl(null, Validators.required),
      keyTypeCode: new FormControl(null, Validators.required),
      budgetPeriodId: new FormControl(0, Validators.required)
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
      const url = this.mode === 'insert'
        ? YearPolicy.apiAddress + 'Create'
        : YearPolicy.apiAddress + 'Update';


      this.isLoadingSubmit = true;
      this.httpService
        .post<YearPolicy>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'YearPolicy',
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

  getTypeCodeList() {
    this.httpService
      .get<TypeCode[]>(TypeCode.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(YearPolicy.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
