import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  AllRoleDocumentTypeTree,
  Permission,
  Role,
  RolePermissions,
  UrlBuilder,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'app-permission-role-assignment',
  templateUrl: './permission-role-assignment.component.html',
  styleUrls: ['./permission-role-assignment.component.scss'],
})
export class PermissionRoleAssignmentComponent implements OnInit {
  /** نقش‌ها  */
  roles: Role[] = [];
  /** نقش انتخاب شده */
  selectedRole = new Role();

  /** سطح‌های دسترسی */
  permissions!: RolePermissions[];
  /** سطح‌های دسترسی انتخاب شده */
  selectedPermissions: RolePermissions[] = [];

  loading = false;

  assertionLoading = false;

  permissionIdList: number[] = [];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
  }

  /*--------------------------
  # Role
  --------------------------*/
  getRoles() {
    this.httpService.post<Role[]>(Role.apiAddress, { withOutPagination: true }).subscribe(response => {
      if (response.data.result && response.data.result.length) {
        this.roles = response.data.result;
        this.selectedRole = response.data.result[0];
      }
    });
  }

  /*--------------------------
  # Permissions
  --------------------------*/
  getPermissions(roleId = 1) {
    if (roleId) {
      this.loading = true;

      this.httpService
        .get<RolePermissions[]>(RolePermissions.apiAddress + `/${roleId}`)
        .pipe(
          tap(() => (this.loading = false)),
          map(response => {
            if (response.data && response.data.result) {
              const permissions = response.data.result;

              this.selectedPermissions = [];
              this.permissionIdList = [];

              this.returnSelectedItems(permissions);

              return response.data.result;
            } else return [new RolePermissions()];
          })
        )
        .subscribe(permissions => (this.permissions = permissions));
    }
  }

  returnSelectedItems(
    permissions: AllRoleDocumentTypeTree[],
    parent = null
  ) {
    permissions.forEach((p: any) => {
      if (p.hasPermission) {
        this.isExistAndPush(p);
        if (parent) this.isExistAndPush(parent);
      }
      if (p.children) this.returnSelectedItems(p.children, p);
    });
    return this.selectedPermissions;
  }

  isExistAndPush(p: AllRoleDocumentTypeTree) {
    const isExist = this.selectedPermissions.filter(x => x.id === p.id);
    if (isExist.length === 0) this.selectedPermissions.push(p);
    else return;
  }
  /*--------------------------
  # Create
  --------------------------*/
  assignPermissionsToRole(roleId: number) {
    if (roleId) {
      this.assertionLoading = true;
      this.selectedPermissions.forEach(element => {
        const tmp = this.permissionIdList.filter(x => x === element.id);
        if (tmp.length === 0) this.permissionIdList.push(element.id);
      });
      this.httpService
        .post<Permission>(UrlBuilder.build(Permission.apiAddress, 'UPDATE'), {
          roleId: roleId,
          permissions: this.permissionIdList,
        })
        .pipe(
          tap(() => {
            this.assertionLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'permissionRoleAssignment',
              life: 8000,
              severity: 'success',
              detail: `مجوز`,
              summary: 'با موفقیت تخصیص داده شد',
            });

            this.getPermissions(roleId);
          }
        });
    }
  }
}
