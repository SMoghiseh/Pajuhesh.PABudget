import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { YearActivity, RelationType } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-related-activity',
  templateUrl: './add-edit-related-activity.component.html',
  styleUrls: ['./add-edit-related-activity.component.scss']
})
export class AddEditRelatedActivityComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  yearActivityList: any = [];
  relatedYearActivityList: any = [];
  relationTypeList: any = [];


  inputData = new YearActivity();
  @Input() mode = '';
  @Input() set data1(data: YearActivity) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get yearActivityId() {
    return this.addEditForm.get('yearActivityId');
  }
  get relatedYearActivityId() {
    return this.addEditForm.get('relatedYearActivityId');
  }
  get relationType() {
    return this.addEditForm.get('relationType');
  }



  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getYearActivityList();
    this.getRelationTypeList();

    this.addEditForm = new FormGroup({
      yearActivityId: new FormControl(''),
      relatedYearActivityId: new FormControl(''),
      relationType: new FormControl(''),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      yearActivityId: Number(this.route.snapshot.paramMap.get('yearActivityId'))
    })

    this.getRelatedYearActivityList(Number(this.route.snapshot.paramMap.get('yearActivityId')));
  }

  addEditBudget() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = this.mode === 'insert'
        ? YearActivity.apiAddress + 'Create'
        : YearActivity.apiAddress + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<YearActivity>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'YearActivity',
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

  getYearActivityList() {
    this.httpService
      .post<YearActivity[]>(YearActivity.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.yearActivityList = response.data.result;
        }
      });
  }

  getRelatedYearActivityList(yearActivityId: number) {
    this.httpService
      .get<YearActivity[]>(YearActivity.apiAddressExceptedYearActivities + 'List/' + yearActivityId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.relatedYearActivityList = response.data.result;
        }
      });
  }

  getRelationTypeList() {
    this.httpService
      .get<RelationType[]>(RelationType.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.relationTypeList = response.data.result;
        }
      });
  }



  getRowData(id: number) {
    this.httpService
      .get<any>(YearActivity.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }

}
