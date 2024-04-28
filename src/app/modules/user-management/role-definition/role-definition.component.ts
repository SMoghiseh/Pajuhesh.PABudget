

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { CreateRole, Role } from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-role-definition',
  templateUrl: './role-definition.component.html',
  styleUrls: ['./role-definition.component.scss'],
})
export class RoleDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  roleList: Role[] = [];

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  gridClass = 'p-datatable-sm';

  /*--------------------------
  # Add new role form
  --------------------------*/
  /** گروه فرم افزودن نقش جدید */
  addNewRoleForm!: FormGroup;

  /** مدل افزودن نقش جدید */
  addNewRoleModel = new Role();

  /** وضعیت تایید افزودن نقش جدید */
  addNewRoleFormSubmitted = false;

  /** انتظار برای افزودن نقش جدید*/
  addNewRoleFormLoading = false;

  first = 0;

  /** کد */
  get title() {
    return this.addNewRoleForm.get('title');
  }
  /** شرح */
  get name() {
    return this.addNewRoleForm.get('name');
  }

  @ViewChild('dataTable') dataTable!: Table;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.addNewRoleForm = new FormGroup({
      name: new FormControl(this.addNewRoleModel.name, Validators.required),
      title: new FormControl(this.addNewRoleModel.title, Validators.required),
    });
  }

  /*--------------------------
  # GET
  --------------------------*/
  /** Get roles from server. */
  getRoleList() {
    this.loading = true;
    this.first = 0;
    this.httpService
      .post<Role[]>(Role.apiAddress, { withOutPagination: true })
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new Role()];
        })
      )
      .subscribe(roleList => (this.roleList = roleList));
  }

  /*--------------------------
  # INSERT
  --------------------------*/
  /** Add new role */
  addNewRole() {
    this.addNewRoleFormSubmitted = true;

    if (this.addNewRoleForm.valid) {
      this.addNewRoleFormLoading = true;

      const { name, title } = this.addNewRoleForm.value;

      const request = new Role();
      request.name = PersianNumberService.toEnglish(name);
      request.title = PersianNumberService.toEnglish(title);

      this.httpService
        .post<CreateRole>(CreateRole.apiAddress, request)
        .pipe(
          tap(() => {
            this.addNewRoleFormLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getRoleList();

            this.messageService.add({
              key: 'roleDefinition',
              life: 8000,
              severity: 'success',
              detail: `نقش ${PersianNumberService.toPersian(title)}`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewPersonForm();
            this.dataTable.reset();
          }
        });
    }
  }

  /*--------------------------
  # EXTRA
  --------------------------*/
  /** Reset add new role form. */
  resetAddNewPersonForm() {
    this.addNewRoleFormSubmitted = false;
    this.addNewRoleForm.reset();
  }
}
