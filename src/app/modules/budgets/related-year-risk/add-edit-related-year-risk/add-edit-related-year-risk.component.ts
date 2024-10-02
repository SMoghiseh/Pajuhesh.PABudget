import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RelatedYearRisk, YearRisk, YearActivity } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-related-year-risk',
  templateUrl: './add-edit-related-year-risk.component.html',
  styleUrls: ['./add-edit-related-year-risk.component.scss']
})
export class AddEditRelatedYearRiskComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  yearList: any = [];
  yearActivityList: any = [];

  inputData = new RelatedYearRisk();
  @Input() mode = '';
  @Input() set data(data: RelatedYearRisk) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get yearRiskId() {
    return this.addEditForm.get('yearRiskId');
  }
  get yearActivityId() {
    return this.addEditForm.get('yearActivityId');
  }
  get isOptimistically() {
    return this.addEditForm.get('isOptimistically');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getYearList();
    this.getYearActivityList();

    this.addEditForm = new FormGroup({
      yearActivityId: new FormControl(null, Validators.required),
      yearRiskId: new FormControl(0, Validators.required),
      isOptimistically: new FormControl(1)
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      yearRiskId: Number(this.route.snapshot.paramMap.get('yearRisk'))
    })

  }

  addEditRelatedYearRisk() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      request.isOptimistically = request.isOptimistically ? true : false;
      const url = this.mode === 'insert' ? RelatedYearRisk.apiAddress + 'RelatedYearRiskProgram/' + 'Create' :
        RelatedYearRisk.apiAddress + 'RelatedYearRiskProgram/' + 'Update';
      this.isLoadingSubmit = true;
      this.httpService
        .post<RelatedYearRisk>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'RelatedYearRisk',
              life: 8000,
              severity: 'success',
              // detail: ` عنوان  ${request.yearActivityTitle}`,
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

  getYearList() {
    this.httpService
      .post<YearRisk[]>(YearRisk.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.yearList = response.data.result;
        }
      });
  }

  getYearActivityList() {
    this.httpService
      .post<YearActivity[]>(YearActivity.apiAddress + 'List',
        {
          withOutPagination: true
        })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.yearActivityList = response.data.result;
        }
      });
  }


  getRowData(id: number) {
    this.httpService
      .get<any>(RelatedYearRisk.apiAddress + 'RelatedYearRiskProgram/Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
