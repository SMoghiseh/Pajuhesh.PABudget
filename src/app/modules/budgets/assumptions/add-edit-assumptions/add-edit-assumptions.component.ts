import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Assumptions,
  Company,
  Period,
  TypeCodeAssumptions,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'PABudget-add-edit-assumptions',
  templateUrl: './add-edit-assumptions.component.html',
  styleUrls: ['./add-edit-assumptions.component.scss'],
})
export class AddEditAssumptionsComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  budgetPeriodList: any = [];
  aspectCodeList: any = [];
  companyList: any = [];
  typeCodeList: any = [];

  inputData = new Assumptions();
  @Input() mode = '';
  @Input() set data1(data: Assumptions) {
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
  get typeCode() {
    return this.addEditForm.get('typeCode');
  }
  get aspectCode() {
    return this.addEditForm.get('aspectCode');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBudgetPeriodList();
    this.getCompanyLst();
    this.getTypeCodeList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      companyId: new FormControl(0, Validators.required),
      typeCode: new FormControl(0, Validators.required),
      budgetPeriodId: new FormControl(0, Validators.required),
      aspectCode: new FormControl(0),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      budgetPeriodId: Number(this.route.snapshot.paramMap.get('id')),
    });
  }

  addEditBudget() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = Assumptions.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<Assumptions>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'Assumptions',
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

  getTypeCodeList() {
    this.httpService
      .get<TypeCodeAssumptions[]>(TypeCodeAssumptions.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(Assumptions.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
