import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  GeneralPerson,
  Pagination,
  PersonRole
} from '@shared/models/response.model';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-user-role-assignment',
  templateUrl: './user-role-assignment.component.html',
  styleUrls: ['./user-role-assignment.component.scss'],
  providers: [ConfirmationService]

})
export class UserRoleAssignmentComponent implements OnInit {

  users: GeneralPerson[] = [];
  selectedUser = new GeneralPerson();
  totalCount!: number;
  userRolesList: PersonRole[] = [];
  loading = false;
  dataTableRows = 10;
  gridClass = 'p-datatable-sm';
  modalTitle = '';
  mode!: string;
  first = 0;
  isOpenAddRoleAssignment = false;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
  }

  addRoleAssignment() {
    this.modalTitle = 'افزودن نقش ';
    this.mode = 'insert';
    this.isOpenAddRoleAssignment = true;
  }

  deleteRow(role: PersonRole) {
    if (role && role.roleId)
      this.confirmationService.confirm({
        message: 'آیا از حذف کاربر اطمینان دارید؟',
        header: ` ${role.firstName} ${role.lastName} - ${role.roleName}`,
        icon: 'pi pi-user-minus',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePerson(role),
      });
  }

  /** Delete role */
  deletePerson(role: PersonRole) {

    const body = {
      userId: role.userId,
      roleId: role.roleId,
    };

    this.httpService
      .post<PersonRole[]>(PersonRole.apiAddressRemove, body)
      .pipe(
        tap(() => (this.loading = false)),
      )
      .subscribe(response => {
        if (response.successed) {
          this.first = 0;
          this.messageService.add({
            key: 'roleDefinition',
            life: 8000,
            severity: 'success',
            detail: `${role.firstName} ${role.lastName} - ${role.roleName}`,
            summary: 'با موفقیت حذف شد',
          });

          this.getUserRolesList();
        }
      });

  }





  /*--------------------------
  # Get
  --------------------------*/
  getUserRolesList(event?: LazyLoadEvent) {
    this.first = 0;
    const pagination = new Pagination();
    const first = event?.first || 0;
    const rows = event?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    this.loading = true;

    this.httpService
      .post<PersonRole[]>(PersonRole.apiAddress, pagination)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.totalCount != undefined)
            this.totalCount = response.data.totalCount;
          if (response.data && response.data.result)
            return response.data.result;
          else return [new PersonRole()];
        })
      )
      .subscribe(userRolesList => (this.userRolesList = userRolesList));
  }

  reloadData() {
    this.isOpenAddRoleAssignment = false;
    this.getUserRolesList();
  }

}
