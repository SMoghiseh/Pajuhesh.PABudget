import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { BigGoal, RelatedBigGoal } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-related-big-goal',
  templateUrl: './add-edit-related-big-goal.component.html',
  styleUrls: ['./add-edit-related-big-goal.component.scss']
})
export class AddEditRelatedBigGoalComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  relatedBigGoalList: any = [];
  bigGoalList: any = [];




  inputData = new RelatedBigGoal();
  @Input() mode = '';
  @Input() set data1(data: RelatedBigGoal) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get bigGoalId() {
    return this.addEditForm.get('bigGoalId');
  }

  get relatedBigGoalId() {
    return this.addEditForm.get('relatedBigGoalId');
  }


  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getRelatedBigGoalList();
    this.getBigGoalList();


    this.addEditForm = new FormGroup({
      relatedBigGoalId: new FormControl(null),
      bigGoalId: new FormControl(null),
    });

    this.addEditForm.patchValue({
      bigGoalId: Number(this.route.snapshot.paramMap.get('bigGoalId'))
    })


  }

  getRelatedBigGoalList() {
    this.httpService
      .get<any[]>(RelatedBigGoal.apiAddressList +
        Number(this.route.snapshot.paramMap.get('bigGoalId'))
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.relatedBigGoalList = response.data.result;
        }
      });
  }

  getBigGoalList() {
    this.httpService
      .post<any[]>(BigGoal.apiAddress + 'List', {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.bigGoalList = response.data.result;
        }
      });
  }


  addEditPlan() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = RelatedBigGoal.apiAddress + 'Create';
      this.isLoadingSubmit = true;
      this.httpService
        .post<RelatedBigGoal>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'relatedBigGoal',
              life: 8000,
              severity: 'success',
              // detail: ` عنوان  ${request.title}`,
              summary: this.mode === 'insert'
                ? 'با موفقیت درج شد'
                : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }








}
