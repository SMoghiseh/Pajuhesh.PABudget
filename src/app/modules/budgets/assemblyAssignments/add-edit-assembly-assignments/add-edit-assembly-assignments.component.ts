import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { AssemblyAssignments, Company } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-assembly-assignments',
  templateUrl: './add-edit-assembly-assignments.component.html',
  styleUrls: ['./add-edit-assembly-assignments.component.scss'],
})
export class AddEditAssemblyAssignmentsComponent {
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  MeetingTopicList: any = [];
  companyList: any = [];
  inputData = new AssemblyAssignments();
  @Input() mode = '';
  @Input() set data1(data: AssemblyAssignments) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();
  get budgetPeriodId() {
    return this.addEditForm.get('budgetPeriodId');
  }
  get meetingId() {
    return this.addEditForm.get('meetingId');
  }
  get typeCode() {
    return this.addEditForm.get('typeCode');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get title() {
    return this.addEditForm.get('title');
  }
  get meetingDate() {
    return this.addEditForm.get('meetingDate');
  }
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getMeetingTopicList();
    this.getCompanyLst();
    this.addEditForm = new FormGroup({
      budgetPeriodId: new FormControl(),
      meetingId: new FormControl(0),
      typeCode: new FormControl(null),
      companyId: new FormControl(null),
      title: new FormControl(null),
      // meetingDate: new FormControl(),
    });
    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
    if (this.mode === 'insert') {
      this.route.params.subscribe((param: any) => {
        if (param.id) {
          this.addEditForm.patchValue({
            budgetPeriodId: param.id,
          });
        }
      });
    }
  }

  getRowData(id: number) { debugger
    this.httpService
      .get<any>(AssemblyAssignments.apiAddress + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
  addEditAssemblyAssignment() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url =
        this.mode === 'insert'
          ? AssemblyAssignments.apiAddress + 'Create'
          : AssemblyAssignments.apiAddress + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<AssemblyAssignments>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'AssemblyAssignmen',
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
  getMeetingTopicList() {
    this.httpService
      .get<AssemblyAssignments[]>(
        AssemblyAssignments.apiAddressMeetingTopic + 'List',
        {
          withOutPagination: true,
        }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.MeetingTopicList = response.data.result;
        }
      });
  }
  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
}
