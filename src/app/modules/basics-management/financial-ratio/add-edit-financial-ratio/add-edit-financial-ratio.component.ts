import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinancialRatio } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'PABudget-add-edit-financial-ratio',
  templateUrl: './add-edit-financial-ratio.component.html',
  styleUrls: ['./add-edit-financial-ratio.component.scss']
})
export class AddEditFinancialRatioComponent {
  public datePipe = new DatePipe('en-US');

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  companyList: any = [];



  inputData = new FinancialRatio();
  @Input() mode = '';
  @Input() set data(data: FinancialRatio) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();


  get title() {
    return this.addEditForm.get('title');
  }
  get description() {
    return this.addEditForm.get('description');
  }
  get typeCode() {
    return this.addEditForm.get('typeCode');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.getTypeCodeList();
    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      typeCode: new FormControl(null, Validators.required),
      description: new FormControl(null)
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }
  }

  addEditFinancialRatio() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;

      const url = this.mode === 'insert' ? FinancialRatio.apiAddress + 'Create' :
        FinancialRatio.apiAddress + 'Update';
      this.isLoadingSubmit = true;

      this.httpService
        .post<FinancialRatio>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'FinancialRatio',
              life: 8000,
              severity: 'success',
              detail: ` برنامه  ${request.title}`,
              summary: this.mode === 'insert'
                ? 'با موفقیت درج شد'
                : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }

  getTypeCodeList() {
    this.httpService
      .get<FinancialRatio[]>(FinancialRatio.apiAddressTypeCode + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(FinancialRatio.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result)
        }
      });
  }

}
