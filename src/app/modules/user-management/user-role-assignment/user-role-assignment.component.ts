

import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  AssignRole,
  Company,
  GeneralPerson,
  Pagination,
  PersonRole,
  Role,
} from '@shared/models/response.model';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-user-role-assignment',
  templateUrl: './user-role-assignment.component.html',
  styleUrls: ['./user-role-assignment.component.scss'],
})
export class UserRoleAssignmentComponent implements OnInit {
  /*--------------------------
  # GeneralPerson
  --------------------------*/
  /** کاربرها  */
  users: GeneralPerson[] = [];
  /** کاربر انتخاب شده */
  selectedUser = new GeneralPerson();

  /*--------------------------
  # Role
  --------------------------*/
  /** نقش‌ها  */
  roles: Role[] = [];
  /** نقش انتخاب شده */
  selectedRole = new Role();

  /*--------------------------
  # Company
  --------------------------*/
  /** سازمان‌ها  */
  companies: Company[] = [];
  /** سازمان انتخاب شده */
  selectedCompany = new Company();

  /*--------------------------
  # Assign
  --------------------------*/
  assignRoleLoading = false;

  /*--------------------------
  # TABLE
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  userRolesList: PersonRole[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  gridClass = 'p-datatable-sm';

  first = 0;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getDocumentGroups();
    this.getRoles();
    this.getCompanies();
  }

  /*--------------------------
  # GeneralPerson
  --------------------------*/
  getDocumentGroups() {
    this.httpService
      .get<GeneralPerson[]>(GeneralPerson.apiAddress)
      .subscribe(response => {
        if (response.data.result) {
          this.users = response.data.result;
        }
      });
  }
  /*--------------------------
  # GeneralPerson
  --------------------------*/
  getRoles() {
    this.httpService.post<Role[]>(Role.apiAddress, { withOutPagination: true }).subscribe(response => {
      if (response.data.result) {
        this.roles = response.data.result;
      }
    });
  }

  /*--------------------------
  # Company
  --------------------------*/
  getCompanies() {
    this.httpService.get<Company[]>(Company.apiAddress).subscribe(response => {
      if (response.data.result) {
        this.companies = response.data.result;
      }
    });
  }

  /*--------------------------
  # Assign
  --------------------------*/
  assignRoleTouser(user: GeneralPerson, role: Role, company: Company) {
    if (user.id && role.id) {
      this.assignRoleLoading = true;

      this.httpService
        .post<AssignRole>(AssignRole.apiAddress, {
          roleId: role.id,
          userId: user.userId,
          companyId: role.isNeedCompany ? company.id : null,
        })
        .pipe(
          tap(() => {
            this.assignRoleLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'userRoleAssignment',
              life: 8000,
              severity: 'success',
              detail: `نقش`,
              summary: 'با موفقیت تخصیص داده شد',
            });

            this.getUserRolesList();
            this.getDocumentGroups();
            this.selectedCompany = new Company();
            this.selectedRole = new Role();
          }
        });
    } else {
      this.messageService.add({
        key: 'userRoleAssignment',
        life: 8000,
        severity: 'warn',
        detail: `هشدار`,
        summary: 'اطلاعات وارد شده کامل نیست',
      });
    }
  }

  resetSelectedCompany(role: Role) {
    if (!role.isNeedCompany) this.selectedCompany = new Company();
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
}
