

import { Component } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Role, UrlBuilder } from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-role-definition',
  templateUrl: './role-definition.component.html',
  styleUrls: ['./role-definition.component.scss'],
  providers: [ConfirmationService]
})
export class RoleDefinitionComponent {

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  roleList: Role[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddRole = false;
  addEditData = new Role();
  pId!: string;
  mode!: string;
  addNewRoleFormLoading = false;

  // search property 
  fullTextSearch?: string;
  pageNumber!: number;
  pageSize!: number;
  currentPage!: number;
  propertyName: string | null = null;
  isAsc!: boolean;

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

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
      withOutPagination: true,
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
    // this.addNewRoleFormSubmitted = true;

    // if (this.addNewRoleForm.valid) {
    //   this.addNewRoleFormLoading = true;

    //   const { name, title } = this.addNewRoleForm.value;

    //   const request = new Role();
    //   request.id = this.selectedRoleItem.id || 0;
    //   request.name = PersianNumberService.toEnglish(name);
    //   request.title = PersianNumberService.toEnglish(title);

    //   // const typeOpe = request.id ? 'UPDATE' : 'CREATE';
    //   const typeOpe = 'CREATE';

    //   this.httpService
    //     .post<CreateRole>(UrlBuilder.build(Role.apiAddress, typeOpe),
    //       request)
    //     .pipe(
    //       tap(() => {
    //         this.addNewRoleFormLoading = false;
    //       })
    //     )
    //     .subscribe(response => {
    //       if (response.successed) {
    //         this.getRoleList();

    //         this.messageService.add({
    //           key: 'roleDefinition',
    //           life: 8000,
    //           severity: 'success',
    //           detail: `نقش ${PersianNumberService.toPersian(title)}`,
    //           summary: 'با موفقیت درج شد',
    //         });

    //         this.resetAddNewRoleForm();
    //         this.dataTable.reset();
    //       }
    //     });
    // }
  }


  addRole() {
    this.modalTitle = 'افزودن نقش ';
    this.mode = 'insert';
    this.isOpenAddRole = true;
  }

  editRow(data: Role) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddRole = true;
  }

  deleteRow(role: Role) {
    if (role && role.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف کاربر اطمینان دارید؟',
        header: ` ${role.name} - ${role.title}`,
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

            this.getRoleList();
          }
        });
    }
  }

  reloadData() {
    debugger
    this.isOpenAddRole = false;
    this.getRoleList();
  }

}
