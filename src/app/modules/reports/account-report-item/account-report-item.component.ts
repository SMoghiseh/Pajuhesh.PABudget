import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { AccountReport, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
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
  sourceAccountReport: any;
  target!: false;
  get accountRepId() {
    return this.accountReportItemForm.get('accountRepId');
  }
  get accountRepItemId() {
    return this.accountReportItemForm.get('accountRepItemId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

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
    this.selectedaccountReportIdList = [];
    this.selectedaccountReportList = [];
    this.getAccountReportTree(e.value);
    this.getAccountReporDragDrop(e.value);
  }

  getAccountReportTree(accountReportId: number) {
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
            this.setSelectedNodes(permissions); debugger
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

  getAccountReporDragDrop(ReportId: number) {
    this.httpService
      .get<AccountReport[]>(
        UrlBuilder.build(AccountReport.apiAddressDragDrop, '') + `/${ReportId}`
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new AccountReport()];
        })
      )
      .subscribe(
        accountReportType => (this.sourceAccountReport = accountReportType)
      );
  }
  selectionChange(e: any) {
    debugger
    this.selectedaccountReportIdList = [];

    e.forEach((element: any) => {
      //  this.selectedPermissionList.splice(index, 1)
      this.selectedaccountReportIdList.push(element?.id);
    });
  }

  setSelectedNodes(nodes: any) {
    debugger
    nodes.forEach((element: any) => {
      if (element.isUsedInAccountReportToItem) {
        this.selectedaccountReportList.push(element);
        this.selectedaccountReportIdList.push(element.id);
      }

      if (element.children) this.setSelectedNodes(element.children);
    });

    return this.selectedaccountReportList;
  }

  // buildFileTree()

  reorderAccountReport(item: any) {
    const id = item.items[0].id;
    const idIndex = this.sourceAccountReport.findIndex(
      (item: any) => item.id === id
    );
    const upIdIndex = idIndex + 1;
    const subIdIndex = idIndex - 1;
    const sourceOrder = {
      id: id,
      subId:
        this.sourceAccountReport[upIdIndex] != undefined
          ? this.sourceAccountReport[upIdIndex].id
          : null,
      upId:
        this.sourceAccountReport[subIdIndex] != undefined
          ? this.sourceAccountReport[subIdIndex].id
          : null,
    };
    console.log(sourceOrder);

    this.httpService
      .post<AccountReport[]>(
        AccountReport.apiAddressDragDropUpdate,
        sourceOrder
      )
      .subscribe(response => {
        this.getAccountReporDragDrop(item.items[0].accountRepId); debugger
        // if (response.successed) {
        //   this.messageService.add({
        //     key: 'report',
        //     life: 8000,
        //     severity: 'success',
        //     summary: ' آیتم های گزارش با موفقیت بروزرسانی شد',
        //   });
        // }
      });
  }

  updateAccountRepItem() {
    const { accountRepId, accountRepItemId } = this.accountReportItemForm.value;
    const request = new AccountReport();
    request.accountRepId = accountRepId;
    const getAccountRepItemId: number[] = [];
    accountRepItemId.forEach((element: any) => {
      getAccountRepItemId.push(element.id);
    });
    // request.accountRepItemId = getAccountRepItemId;

    // remove repetitive items
    request.accountRepItemId = [...new Set(getAccountRepItemId)];

    this.httpService
      .post<AccountReport[]>(
        UrlBuilder.build(AccountReport.apiAddressItemCreate, ''),
        request
      )
      .subscribe(response => {
        if (response.successed) {
          this.getAccountReporDragDrop(accountRepId);
          this.messageService.add({
            key: 'report',
            life: 8000,
            severity: 'success',
            detail: `آیتم های گزارش `,
            summary: 'با موفقیت درج شد',
          });
        }
      });
  }
}
