

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { CreateRole, Role, UrlBuilder } from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-role-definition',
  templateUrl: './role-definition.component.html',
  styleUrls: ['./role-definition.component.scss'],
  providers: [ConfirmationService]
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

  editRoleData!: Role;

  isOpenAddRole = false;
  selectedRoleItem = new Role();

  /** انتظار برای افزودن نقش جدید*/
  addNewRoleFormLoading = false;
  fullTextSearch?: string;
  lazyLoadEvent?: LazyLoadEvent;
  pageNumber!: number;
  pageSize!: number;
  currentPage!: number;
  propertyName: string | null = null;
  isAsc!: boolean;
  first = 0;
  /** انتظار برای حذف کاربر */
  deleteRoleFormLoading = false;
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.pageNumber = 1;
    this.pageSize = 10;
  }

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
  getRoleList(event?: LazyLoadEvent) {

    if (event) this.lazyLoadEvent = event;
    else this.first = 0;

    const searchModel = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      propertyName: this.propertyName,
      isAsc: this.isAsc,
      fullTextSearch: this.fullTextSearch
    }
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    searchModel.pageNumber = first / rows + 1;
    searchModel.pageSize = rows;
    this.loading = true;

    this.httpService
      .post<Role[]>(UrlBuilder.build(Role.apiAddress, 'LIST')
        , searchModel)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.totalCount != undefined)
            this.totalCount = response.data.totalCount;
          if (response.data && response.data.result)
            return response.data.result;
          return [new Role()];
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
      request.id = this.selectedRoleItem.id || 0;
      request.name = PersianNumberService.toEnglish(name);
      request.title = PersianNumberService.toEnglish(title);

      // const typeOpe = request.id ? 'UPDATE' : 'CREATE';
      const typeOpe = 'CREATE';

      this.httpService
        .post<CreateRole>(UrlBuilder.build(Role.apiAddress, typeOpe),
          request)
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

            this.resetAddNewRoleForm();
            this.dataTable.reset();
          }
        });
    }
  }

  /*--------------------------
  # EXTRA
  --------------------------*/
  /** Reset add new role form. */
  resetAddNewRoleForm() {
    this.addNewRoleFormSubmitted = false;
    this.addNewRoleForm.reset();
    this.selectedRoleItem = new Role();
  }
  onEdit(role: Role) {
    // this.editRoleData = role;
    // this.isOpenAddRole = true;
    this.selectedRoleItem = role;
    this.addNewRoleForm.patchValue(role);
  }

  onDelete(role: Role) {
    if (role && role.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف کاربر اطمینان دارید؟',
        header: `کاربر ${role.title}`,
        icon: 'pi pi-user-minus',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePerson(role.id, role.title),
      });
  }

  /** Delete role */
  deletePerson(id: number, firstName: string) {
    if (id && firstName) {
      // this.editPersonFormLoading = true;

      this.httpService
        .post<Role>(`${Role.deleteApiAddress}${id}`, '')
        .pipe(
          tap(() => {
            // this.editPersonFormLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getRoleList();
            this.first = 0;

            this.messageService.add({
              key: 'roleDefinition',
              life: 8000,
              severity: 'success',
              detail: `کاربر ${PersianNumberService.toPersian(firstName)}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewRoleForm();
          }
        });
    }
  }

  onOpenAddPerson() {
    this.editRoleData = new Role();
    this.isOpenAddRole = true;
  }
  onCloseModal() {
    this.isOpenAddRole = false;
    this.getRoleList();
  }

}
