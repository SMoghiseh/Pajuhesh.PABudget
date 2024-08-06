import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { AccountReport, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { title } from 'process';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-account-report-item',
  templateUrl: './account-report-item.component.html',
  styleUrls: ['./account-report-item.component.scss'],
  providers: [ConfirmationService],
})
export class AccountReportItemComponent {
  accountReportItemForm!: FormGroup;
  accountReportList: any = [];
  loading = false;
  accountReportType: AccountReport[] = [];
  selectedNodes: any;
  accountReportTree: any;
  selectedPermissions: AccountReport[] = [];
  permissions!: AccountReport[];
  selectedaccountReportList: any = [];
  selectedaccountReportIdList: number[] = [];
  itemList: TreeNode[] = [];
  selectedApp: any;
  appList: any;
  get accountRepId() {
    return this.accountReportItemForm.get('accountRepId');
  }
  get accountRepItemId() {
    return this.accountReportItemForm.get('accountRepItemId');
  }
  constructor(
    private httpService: HttpService,
    private messageService: MessageService
    
  ) {}
  ngOnInit(): void {
    this.getAccountReportLst();
    this.accountReportItemForm = new FormGroup({
      accountRepId: new FormControl(),
      accountRepItemId: new FormControl(),
    });
  }

  getAccountReportLst() {
    this.httpService
      .post<AccountReport[]>(AccountReport.apiAddress + 'GetAllAccountReport', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.accountReportList = response.data.result;
        }
      });
  }
  onChangeAccountRep(e: any) {
    debugger;
    this.selectedaccountReportIdList = [];
    this.selectedaccountReportList = [];
    this.getAccountReportTree(e.value);
  }

  getAccountReportTree(accountReportId: number) {
    debugger;
    this.loading = true;
    this.httpService
      .get<AccountReport[]>(
        UrlBuilder.build(AccountReport.apiAddressTree, '') +
          `/${accountReportId}`
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            const permissions = response.data.result;
            this.setSelectedNodes(permissions);
            this.accountReportItemForm.patchValue({
              accountRepItemId: this.selectedaccountReportList,
            });
            return response.data.result;
          } else return [new AccountReport()];
        })
      )
      .subscribe(
        accountReportType => (this.accountReportTree = accountReportType)
      );
  }
  selectionChange(e: any) {
    debugger;
    this.selectedaccountReportIdList = [];

    e.forEach((element: any) => {
      //  this.selectedPermissionList.splice(index, 1)
      this.selectedaccountReportIdList.push(element?.id);
    });
  }

  setSelectedNodes(nodes: any) {
    debugger;
    nodes.forEach((element: any) => {
      if (element.isUsedInAccountReportToItem) {
        this.selectedaccountReportList.push(element);
        this.selectedaccountReportIdList.push(element.id);
      }

      if (element.children) this.setSelectedNodes(element.children);
    });

    return this.selectedaccountReportList;
  }

  updateAccountRepItem() {
    debugger;
    const { accountRepId, accountRepItemId } = this.accountReportItemForm.value;
    const request = new AccountReport();
    request.accountRepId = accountRepId;
    const getAccountRepItemId: any = [];
    accountRepItemId.forEach((element: any) => {
      getAccountRepItemId.push(element.id);
    });
    request.accountRepItemId = getAccountRepItemId;
    this.httpService
      .post<AccountReport[]>(
        UrlBuilder.build(AccountReport.apiAddressItemCreate, ''),
        request
      )
      .subscribe(response => {
        if (response.successed) {
          debugger;
          this.messageService.add({
            key: 'report',
            life: 8000,
            severity: 'success',
            detail: `اطلاعات شرکت`,
            summary: 'با موفقیت درج شد',
          });
        }
      });
  }
}
