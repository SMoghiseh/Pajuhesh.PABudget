import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningValue, Company, KeyTypecode, Planning } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-add-edit-planning-value',
  templateUrl: './add-edit-planning-value.component.html',
  styleUrls: ['./add-edit-planning-value.component.scss']
})
export class AddEditPlanningValueComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  accountPlanItemList: any = [];
  companyList: any = [];
  planingList: any = [];
  KeyTypeList: any = [];



  inputData = new PlanningValue();
  @Input() mode = '';
  @Input() set data(data: PlanningValue) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get planningValueCode() {
    return this.addEditForm.get('planningValueCode');
  }
  get title() {
    return this.addEditForm.get('title');
  }

  get companyId() {
    return this.addEditForm.get('companyId');
  }

  get planingId() {
    return this.addEditForm.get('planingId');
  }

  get keyTypeCode() {
    return this.addEditForm.get('keyTypeCode');
  }



  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.getPlaningList();
    this.getCompanyLst();
    this.getkeyTypeCodeLst();

    this.addEditForm = new FormGroup({
      planningValueCode: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      companyId: new FormControl(0),
      keyTypeCode: new FormControl(0),
      planingId: new FormControl('', Validators.required),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
  }

  addEditPlan() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;

      const url = PlanningValue.apiAddress + 'Create';
      this.isLoadingSubmit = true;

      this.httpService
        .post<PlanningValue>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'plan',
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

  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getPlaningList() {
    this.httpService
      .post<Planning[]>(Planning.apiAddress + 'List', { "withOutPagination": true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.planingList = response.data.result;
        }
      });
  }

  getkeyTypeCodeLst() {
    this.httpService
      .get<KeyTypecode[]>(KeyTypecode.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.KeyTypeList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(PlanningValue.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }





}

