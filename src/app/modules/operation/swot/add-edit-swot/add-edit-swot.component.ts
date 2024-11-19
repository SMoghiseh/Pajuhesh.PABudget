import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SWTO, Planning, KeyTypecode } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-swot',
  templateUrl: './add-edit-swot.component.html',
  styleUrls: ['./add-edit-swot.component.scss']
})
export class AddEditSwotComponent {

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  planingList: any = [];
  typeCodeList: any = [];



  inputData = new SWTO();
  @Input() mode = '';
  @Input() set data1(data: SWTO) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get title() {
    return this.addEditForm.get('title');
  }
  get planningId() {
    return this.addEditForm.get('planningId');
  }
  get typeCode() {
    return this.addEditForm.get('typeCode');
  }
  get swotRank() {
    return this.addEditForm.get('swotRank');
  }
  get swoPriority() {
    return this.addEditForm.get('swoPriority');
  }




  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getPlaningList();
    this.getTypeCodeList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      planningId: new FormControl('', Validators.required),
      typeCode: new FormControl('', Validators.required),
      swotRank: new FormControl('', Validators.required),
      swoPriority: new FormControl('', Validators.required)
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
      const url = SWTO.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<SWTO>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'swot',
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

  getTypeCodeList() {
    this.httpService
      .get<KeyTypecode[]>(KeyTypecode.swotApiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
        }
      });
  }



  getRowData(id: number) {
    this.httpService
      .get<any>(SWTO.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }


  validateInputSwotRank(event: KeyboardEvent) {
    const charCode = event.key;
    const input = (event.target as HTMLInputElement).value;

    // Allow backspace and delete
    if (charCode === 'Backspace' || charCode === 'Delete') {
      return;
    }

    // Prevent entering values starting with '0' unless it’s '0'
    if (input === '' && charCode === '0') {
      event.preventDefault();
    }
    if (input === '0' && charCode) {
      event.preventDefault();
    }

    // Prevent values greater than 100
    const newValue = parseInt(input + charCode, 10);
    if (newValue > 101) {
      event.preventDefault();
    }

  }

  validateInputStrategyPriority(event: KeyboardEvent) {
    const charCode = event.key;
    const input = (event.target as HTMLInputElement).value;

    // Allow backspace and delete
    if (charCode === 'Backspace' || charCode === 'Delete') {
      return;
    }

    // Prevent entering values starting with '0' unless it’s '0'
    if (input === '' && charCode === '0') {
      event.preventDefault();
    }

    // Prevent values greater than 100
    const newValue = parseInt(input + charCode, 10);
    if (newValue > 10) {
      event.preventDefault();
    }

  }


}

