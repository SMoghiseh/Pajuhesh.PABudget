import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BigGoal, Aspect, Vision } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-big-goal',
  templateUrl: './add-edit-big-goal.component.html',
  styleUrls: ['./add-edit-big-goal.component.scss'],
})
export class AddEditBigGoalComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  visionList: any = [];
  aspectCodeList: any = [];

  inputData = new BigGoal();
  @Input() mode = '';
  @Input() set data(data: BigGoal) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get title() {
    return this.addEditForm.get('title');
  }

  get visionId() {
    return this.addEditForm.get('visionId');
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
    this.getVisionList();
    this.getAspectCodeList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      aspectCode: new FormControl(0, Validators.required),
      visionId: new FormControl(0, Validators.required),
      description: new FormControl(),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
    this.addEditForm.patchValue({
      visionId: Number(this.route.snapshot.paramMap.get('id')),
    });
  }

  addEditPlan() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = BigGoal.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<BigGoal>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'bigGoal',
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

  getAspectCodeList() {
    this.httpService
      .get<Aspect[]>(Aspect.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.aspectCodeList = response.data.result;
        }
      });
  }

  getVisionList() {
    this.httpService
      .post<Vision[]>(Vision.apiAddress + 'List', { withOutPagination: true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.visionList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(BigGoal.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
}
