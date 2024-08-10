import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Mission, KeyTypecode, Planning } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-add-edit-mission',
  templateUrl: './add-edit-mission.component.html',
  styleUrls: ['./add-edit-mission.component.scss']
})
export class AddEditMissionComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  planningValueList: any = [];
  planingList: any = [];
  KeyTypeList: any = [];



  inputData = new Mission();
  @Input() mode = '';
  @Input() set data1(data: Mission) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get title() {
    return this.addEditForm.get('title');
  }

  get missionCode() {
    return this.addEditForm.get('missionCode');
  }

  get planningId() {
    return this.addEditForm.get('planningId');
  }

  get typeCode() {
    return this.addEditForm.get('typeCode');
  }



  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.getPlaningList();
    this.getkeyTypeCodeLst();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      missionCode: new FormControl('', Validators.required),
      typeCode: new FormControl(0),
      planningId: new FormControl(null, Validators.required),
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
      const url = this.mode === 'insert' ? Mission.apiAddress + 'Create' :
        Mission.apiAddress + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<Mission>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'mission',
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
      .get<any>(Mission.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }





}

