import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Planning, Company } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';

@Component({
  selector: 'PABudget-add-edit-planning',
  templateUrl: './add-edit-planning.component.html',
  styleUrls: ['./add-edit-planning.component.scss'],
})
export class AddEditPlanningComponent {
  public datePipe = new DatePipe('en-US');

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  accountPlanItemList: any = [];
  companyList: any = [];
  meetingList: any = [];

  inputData = new Planning();
  @Input() mode = '';
  @Input() set data(data: Planning) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get title() {
    return this.addEditForm.get('title');
  }
  get planingDate() {
    return this.addEditForm.get('planingDate');
  }

  get companyId() {
    return this.addEditForm.get('companyId');
  }

  get meetingId() {
    return this.addEditForm.get('meetingId');
  }

  get startDate() {
    return this.addEditForm.get('startDate');
  }
  get endDate() {
    return this.addEditForm.get('endDate');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) {}

  ngOnInit(): void {
    this.getMeetingLst();
    this.getCompanyLst();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      planingDate: new FormControl('', Validators.required),
      companyId: new FormControl(null, Validators.required),
      meetingId: new FormControl(0),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });

    if (this.mode === 'edit') { debugger
      this.getRowData(this.inputData.id);
    }
  }

  addEditPlan() { 
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      request.planingDate = request.planingDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              request.planingDate?.getFullYear(),
              request.planingDate?.getMonth(),
              request.planingDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;
      request.startDate = request.startDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              request.startDate?.getFullYear(),
              request.startDate?.getMonth(),
              request.startDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;
      request.endDate = request.endDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              request.endDate?.getFullYear(),
              request.endDate?.getMonth(),
              request.endDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;

      const url = Planning.apiAddress + 'Create';
      this.isLoadingSubmit = true;

      this.httpService
        .post<Planning>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'plan',
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

  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getMeetingLst() {
    // this.httpService
    //   .get<any[]>('')
    //   .subscribe(response => {
    //     if (response.data && response.data.result) {
    //       this.meetingList = response.data.result;
    //     }
    //   });
  }

  getRowData(id: number) { debugger
    this.httpService
      .get<any>(Planning.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
          this.addEditForm.patchValue({
            startDate: new JDate(new Date(this.inputData.startDate)),
            endDate: new JDate(new Date(this.inputData.endDate)),
            planingDate: new JDate(new Date(this.inputData.planingDate)),
          });
        }
      });
  }
}
