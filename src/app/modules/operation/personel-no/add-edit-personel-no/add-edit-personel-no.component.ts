import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CostCenterType,
  EducationTypeCode,
  EmploymentType,
  Period,
  PersonelNo,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-personel-no',
  templateUrl: './add-edit-personel-no.component.html',
  styleUrls: ['./add-edit-personel-no.component.scss'],
})
export class AddEditPersonelNoComponent implements OnInit {
  addEditPersonelNoForm!: FormGroup;
  addEditPersonelNoSubmitted = false;
  addEditPersonelNoModel = new PersonelNo();
  inputData = new PersonelNo();
  isLoadingSubmit = false;
  periodLst: Period[] = [];
  periodDetailLst: Period[] = [];
  CostCenterLst: CostCenterType[] = [];
  employmentTypeLst: EmploymentType[] = [];
  educationTypeCodeLst: EducationTypeCode[] = [];

  @Input()
  set data(data: PersonelNo) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();
  get periodDetailId() {
    return this.addEditPersonelNoForm.get('periodDetailId');
  }
  get periodId() {
    return this.addEditPersonelNoForm.get('periodId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCostCenterType();
    this.getEmploymentType();
    this.getEducationTypeCode();
    this.addEditPersonelNoForm = new FormGroup({
      periodDetailId: new FormControl(
        this.addEditPersonelNoModel.periodDetailId,
        Validators.required
      ),
      periodId: new FormControl(
        this.addEditPersonelNoModel.periodId,
        Validators.required
      ),
      costCenterTypeId: new FormControl(
        this.addEditPersonelNoModel.costCenterTypeId
      ),
      employmentTypeId: new FormControl(
        this.addEditPersonelNoModel.employmentTypeId
      ),
      educationTypeId: new FormControl(
        this.addEditPersonelNoModel.educationTypeId
      ),
      personelCount: new FormControl(this.addEditPersonelNoModel.personelCount),
      employeewageCU: new FormControl(
        this.addEditPersonelNoModel.employeewageCU
      ),
    });
    if (this.inputData.type === 'edit') {
      this.getPeriodDetailLst(this.inputData.periodId);
      this.addEditPersonelNoForm.patchValue(this.inputData);
    }
  }
  closeModal() {
    this.isCloseModal.emit(false);
  }
  addEditPersonelNo() {
    this.addEditPersonelNoSubmitted = true;
    if (this.addEditPersonelNoForm.valid) {
      const request: PersonelNo = this.addEditPersonelNoForm.value;
      request.id = this.inputData.type === 'insert' ? 0 : this.inputData.id;
      this.isLoadingSubmit = true;

      this.httpService
        .post<Period>(PersonelNo.apiAddress + 'Create', request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'personelNo',
              life: 8000,
              severity: 'success',
              detail: `بودجه پرسنل`,
              summary:
                this.inputData.type === 'insert'
                  ? 'با موفقیت درج شد'
                  : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }

  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodLst = response.data.result;
        }
      });
  }
  onChangePeriod(e: any) {
    this.getPeriodDetailLst(e.value);
  }

  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailLst = response.data.result;
          if (this.inputData.id)
            this.addEditPersonelNoForm.patchValue({
              periodDetailId: this.inputData.periodDetailId,
            });
        }
      });
  }

  getCostCenterType() {
    this.httpService
      .get<CostCenterType[]>(CostCenterType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.CostCenterLst = response.data.result;
        }
      });
  }

  getEmploymentType() {
    this.httpService
      .get<EmploymentType[]>(EmploymentType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.employmentTypeLst = response.data.result;
        }
      });
  }

  getEducationTypeCode() {
    this.httpService
      .get<EducationTypeCode[]>(EducationTypeCode.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.educationTypeCodeLst = response.data.result;
        }
      });
  }
}
