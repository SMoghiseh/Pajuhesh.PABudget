import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vision, KeyTypecode, Planning, PlanningValue } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-vision',
  templateUrl: './add-edit-vision.component.html',
  styleUrls: ['./add-edit-vision.component.scss']
})
export class AddEditVisionComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  planningValueList: any = [];
  planingList: any = [];
  KeyTypeList: any = [];



  inputData = new Vision();
  @Input() mode = '';
  @Input() set data1(data: Vision) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get planningValueId() {
    return this.addEditForm.get('planningValueId');
  }
  get title() {
    return this.addEditForm.get('title');
  }

  get visionCode() {
    return this.addEditForm.get('visionCode');
  }

  get planningId() {
    return this.addEditForm.get('planningId');
  }

  get keyTypeCode() {
    return this.addEditForm.get('keyTypeCode');
  }



  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getPlaningList();
    this.getplanningValueLst();
    this.getkeyTypeCodeLst();

    this.addEditForm = new FormGroup({
      planningValueId: new FormControl(0),
      title: new FormControl('', Validators.required),
      visionCode: new FormControl('', Validators.required),
      keyTypeCode: new FormControl(0),
      planningId: new FormControl(null, Validators.required),
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

    this.addEditForm.patchValue({
      planningId: Number(this.route.snapshot.paramMap.get('id'))
    })
  }

  addEditPlan() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = this.mode === 'insert' ? Vision.apiAddress + 'Create' :
        Vision.apiAddress + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<Vision>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'vision',
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

  getplanningValueLst() {
    this.httpService
      .post<PlanningValue[]>(PlanningValue.apiAddress + 'List', { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.planningValueList = response.data.result;
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
      .get<any>(Vision.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }





}

