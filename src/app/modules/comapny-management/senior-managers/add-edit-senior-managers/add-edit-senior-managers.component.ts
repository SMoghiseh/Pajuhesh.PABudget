import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CompanyManager,
  ManagerType,
  Persons,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';
import { PersianNumberService } from '@shared/services/persian-number.service';

@Component({
  selector: 'PABudget-add-edit-senior-managers',
  templateUrl: './add-edit-senior-managers.component.html',
  styleUrls: ['./add-edit-senior-managers.component.scss'],
})
export class AddEditSeniorManagersComponent {
  public datePipe = new DatePipe('en-US');

  // form property
  addEditManagerForm: FormGroup = new FormGroup({});
  addEditManagerSubmitted = false;
  visibleconditionally = false;
  isLoadingSubmit = false;

  // dropdown data list
  personList: any = [];
  managerTypeList: any = [];
  inputData = new CompanyManager();
  companySelected: any;

  @Input() mode = '';
  @Input() set data2(data: CompanyManager) {
    this.companySelected = data;
  }
  @Input() set data1(data: CompanyManager) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();

  get managerTypeId() {
    return this.addEditManagerForm.get('managerTypeId');
  }
  get registerDate() {
    return this.addEditManagerForm.get('registerDate');
  }
  get dismissalDate() {
    return this.addEditManagerForm.get('dismissalDate');
  }
  get meetingManagementDate() {
    return this.addEditManagerForm.get('meetingManagementDate');
  }
  get meetingManagmentNumber() {
    return this.addEditManagerForm.get('meetingManagmentNumber');
  }
  get name() {
    return this.addEditManagerForm.get('name');
  }
  get lastName() {
    return this.addEditManagerForm.get('lastName');
  }
  get fatherName() {
    return this.addEditManagerForm.get('fatherName');
  }
  get nationalID() {
    return this.addEditManagerForm.get('nationalID');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) { }

  ngOnInit(): void {
    this.getPersonelList();
    this.getManagerTypeList();

    this.addEditManagerForm = new FormGroup({
      managerTypeId: new FormControl(
        this.inputData.managerTypeId,
        Validators.required
      ),
      registerDate: new FormControl(
        this.inputData.registerDate,
        Validators.required
      ),
      dismissalDate: new FormControl(this.inputData.dismissalDate),
      meetingManagementDate: new FormControl(
        this.inputData.meetingManagementDate
      ),
      meetingManagmentNumber: new FormControl(
        this.inputData.meetingManagementDate
      ),
      name: new FormControl(this.inputData.name, Validators.required),
      lastName: new FormControl(this.inputData.lastName, Validators.required),
      fatherName: new FormControl(this.inputData.fatherName, Validators.required),
      gender: new FormControl(this.inputData.gender),
      nationalID: new FormControl(
        this.inputData.nationalID,
        Validators.required
      ),
    });

    if (this.mode === 'edit') {
      this.addEditManagerForm.patchValue(this.inputData);
      debugger
      if (this.inputData.dismissalDate)
        this.addEditManagerForm.patchValue({
          dismissalDate: new JDate(new Date(this.inputData.dismissalDate)),
        });
      if (this.inputData.meetingManagementDate)
        this.addEditManagerForm.patchValue({
          meetingManagementDate: new JDate(
            new Date(this.inputData.meetingManagementDate)
          )
        });
      if (this.inputData.registerDate)
        this.addEditManagerForm.patchValue({
          registerDate: new JDate(new Date(this.inputData.registerDate)),
        });
    }
  }

  addEditManager() {
    this.addEditManagerSubmitted = true;
    if (this.addEditManagerForm.valid) {
      const request = this.addEditManagerForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      request.companyId = this.companySelected.id;
      request.registerDate = request.registerDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.registerDate?.getFullYear(),
            request.registerDate?.getMonth(),
            request.registerDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.dismissalDate = request.dismissalDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.dismissalDate?.getFullYear(),
            request.dismissalDate?.getMonth(),
            request.dismissalDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.meetingManagementDate = request.meetingManagementDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            request.meetingManagementDate?.getFullYear(),
            request.meetingManagementDate?.getMonth(),
            request.meetingManagementDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;

      request.nationalID = PersianNumberService.toEnglish(request.nationalID);

      const url = CompanyManager.apiAddress + 'CreateSeniorManager';
      this.isLoadingSubmit = true;

      Object.entries(request).forEach(([key, val]) => {
        if (!val) request[key] = null;
      });

      this.httpService
        .post<CompanyManager>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'manager',
              life: 8000,
              severity: 'success',
              detail: ` مدیرارشد `,
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

  getPersonelList() {
    this.httpService.get<Persons[]>(Persons.apiAddress).subscribe(response => {
      if (response.data && response.data.result) {
        this.personList = response.data.result;
      }
    });
  }

  getManagerTypeList() {
    this.httpService
      .get<ManagerType[]>(ManagerType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.managerTypeList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(CompanyManager.apiAddress + 'GetManagerById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditManagerForm.patchValue(response.data.result);
        }
      });
  }

  closeModal() {
    this.isCloseModal.emit(false);
  }
}
