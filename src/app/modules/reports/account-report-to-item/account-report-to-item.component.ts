import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  AccountReportItem,
  Profile,
  UrlBuilder,
} from '@shared/models/response.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { map } from 'rxjs';

@Component({
  selector: 'PABudget-account-report',
  templateUrl: './account-report-to-item.component.html',
  styleUrls: ['./account-report-to-item.component.scss'],
  providers: [ConfirmationService],
})
export class AccountReportToItemComponent implements OnInit {
  accountReports: AccountReportItem[] = [];
  addEditData = new AccountReportItem();
  selectedAccountReports: any;
  reportItemTypeList: any;
  selectedReportTypeId!: number;
  isOpenAddAccountReport = false;
  addNewAccountReportForm!: FormGroup;
  modalTitle = '';
  loginData: any;
  mode!:
    | 'insertGroupPro'
    | 'insertSubGroupPro'
    | 'editGroupPro'
    | 'editSubGroupPro';

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {

    const loginData = localStorage.getItem('loginData');
    this.loginData = loginData ? JSON.parse(loginData) : {};
    this.getReportItemType();
  }

  /*--------------------------
  # GET
  --------------------------*/
  getAccountReportList(id: number) {
    this.httpService
      .get<AccountReportItem[]>(AccountReportItem.apiAddress + 'Tree/' + id)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            this.selectedAccountReports = new AccountReportItem();
            this.accountReports = [];
            return response.data.result;
          } else return [new AccountReportItem()];
        })
      )
      .subscribe(accountReports => {
        this.accountReports = accountReports;
      });
  }

  getReportItemType() {
    this.httpService
      .get<any>(UrlBuilder.build(Profile.apiAddressReportItemType, ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.reportItemTypeList = res;
        this.onSelectReportItemType(this.reportItemTypeList[0]['id']);
      });
  }

  onSelectReportItemType(id: number) {
    this.selectedReportTypeId = id;

    this.reportItemTypeList.forEach((element: any) => {
      if (element.id === id) element.isSelected = true;
      else element.isSelected = false;
    });

    this.getAccountReportList(this.selectedReportTypeId);
  }

  onNodeSelect(e: any) {
    console.log('node select');
  }

  onAddNewAccountReport(): void {
    this.isOpenAddAccountReport = true;
    this.modalTitle = 'تعریف  آیتم';
    this.mode = 'insertGroupPro';
  }

  onAddSubGroup(node: any) {
    this.isOpenAddAccountReport = true;
    this.modalTitle = 'تعریف زیرگروه';
    this.mode = 'insertSubGroupPro';
    this.getRowDataById(node.id);
  }

  onEditRow(node: any) {
    this.modalTitle = 'ویرایش گروه';
    if (!node.parentId) this.mode = 'editGroupPro';
    else this.mode = 'editSubGroupPro';
    this.getRowDataById(node.id);
  }

  getRowDataById(id: number) {
    this.httpService
      .get<AccountReportItem>(AccountReportItem.apiAddress + 'GetById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.addEditData = response.data.result;
          this.isOpenAddAccountReport = true;
        }
      });
  }

  onDeleteRow(node: any) {
    setTimeout(() => {
      this.confirmationService.confirm({
        message: 'آیا از حذف گزارش مالی اطمینان دارید؟',
        header: `عنوان ${node.label}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteAccountReports(node.id, node.label),
      });
    }, 100);
  }

  deleteAccountReports(id: number, title: string) {
    this.httpService
      .get<AccountReportItem>(
        AccountReportItem.apiAddress + 'Delete' + `/${id}`
      )
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'accountReportMessage',
            life: 8000,
            severity: 'success',
            detail: `آیتم ${title}`,
            summary: 'با موفقیت حذف شد',
          });
          this.getAccountReportList(this.selectedReportTypeId);
        }
      });
  }

  reloadData() {
    this.isOpenAddAccountReport = false;
    this.getAccountReportList(this.selectedReportTypeId);
  }

  closeModal() {
    this.isOpenAddAccountReport = false;
  }
}
