import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AccountReportItem,
  ReportItemType,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-add-edit-account-report-to-item',
  templateUrl: './add-edit-account-report-to-item.component.html',
  styleUrls: ['./add-edit-account-report-to-item.component.scss'],
})
export class AddEditAccountReportToItemComponent implements OnInit {
  // form property
  addNewAccountReportSubmitted = false;
  addNewAccountReportForm!: FormGroup;
  addNewAccountReportLoading = false;

  // dropdown data list
  itemReportTypeCodeList: any[] = [];
  displayTypeList: any[] = [];

  inputData = new AccountReportItem();
  @Input() mode = '';
  @Input() set data(data: AccountReportItem) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get title() {
    return this.addNewAccountReportForm.get('title');
  }
  get itemReportTypeCode() {
    return this.addNewAccountReportForm.get('itemReportTypeCode');
  }
  get code() {
    return this.addNewAccountReportForm.get('code');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getItemReportTypeCodeList();
    this.getDisplayTypeList();

    this.addNewAccountReportForm = new FormGroup({
      title: new FormControl('', Validators.required),
      itemReportTypeCode: new FormControl(0, Validators.required),
      code: new FormControl(0, Validators.required),
      order: new FormControl(0),
      displayTypeId: new FormControl(),
    });

    if (this.mode == 'editSubGroupPro' || this.mode == 'editGroupPro') { debugger
      this.addNewAccountReportForm.patchValue(this.inputData);
    }
  }

  /*--------------------------
# GET
--------------------------*/

  getItemReportTypeCodeList() {
    this.httpService
      .get<ReportItemType[]>(ReportItemType.apiAddress + 'List')
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new ReportItemType()];
        })
      )
      .subscribe(data => {
        this.itemReportTypeCodeList = data;
      });
  }

  getDisplayTypeList() {
    this.httpService
      .get<ReportItemType[]>(ReportItemType.apiAddressDisType + 'List')
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new ReportItemType()];
        })
      )
      .subscribe(data => {
        this.displayTypeList = data;
      });
  }

  onSubmitNewAccountReport() { debugger
    this.addNewAccountReportSubmitted = true;
    if (this.addNewAccountReportForm.invalid) return;
    const url = AccountReportItem.apiAddress + 'Create';
    const request: AccountReportItem = this.addNewAccountReportForm.value;

    if (this.mode == 'editGroupPro') {
      request.parentId = this.inputData.parentId;
      request.id = this.inputData.id;
    } else if (this.mode == 'editSubGroupPro') {
      request.parentId = this.inputData.parentId;
      request.id = this.inputData.id;
    } else if (this.mode == 'insertSubGroupPro') {
      request.parentId = this.inputData.id;
    } else if (this.mode == 'insertGroupPro') {
      request.parentId = null;
    }

    request.itemReportTypeCode = Number(request.itemReportTypeCode);
    

    this.httpService
      .post<AccountReportItem>(url, request)
      .pipe(tap(() => (this.addNewAccountReportLoading = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'accountReportMessage',
            life: 8000,
            severity: 'success',
            detail: `اطلاعات زیرگروه`,
            summary: 'با موفقیت انجام شد',
          });
          this.isSuccess.emit(true);
        }
      });
  }
}
