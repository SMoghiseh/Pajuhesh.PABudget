import { NgModule } from '@angular/core';
import { CommonModule, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserDefinitionComponent } from './user-definition/user-definition.component';
import { RoleDefinitionComponent } from './role-definition/role-definition.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';
import { PermissionRoleAssignmentComponent } from './permission-role-assignment/permission-role-assignment.component';

/* PrimeNG */
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeModule } from 'primeng/tree';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { TreeSelectModule } from 'primeng/treeselect';
import { AddEditUserComponent } from './user-definition/add-edit-user/add-edit-user.component';
import { AddEditRoleComponent } from './role-definition/add-edit-role/add-edit-role.component';
import { AddEditUserRoleComponent } from './user-role-assignment/add-edit-user-role/add-edit-user-role.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserDefinitionComponent,
    RoleDefinitionComponent,
    AddEditRoleComponent,
    UserRoleAssignmentComponent,
    PermissionRoleAssignmentComponent,
    AddEditUserComponent,
    AddEditUserRoleComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    PasswordModule,
    InputTextareaModule,
    TreeModule,
    BlockUIModule,
    ToastModule,
    ConfirmDialogModule,
    KeyFilterModule,
    TooltipModule,
    DialogModule,
    CheckboxModule,
    ListboxModule,
    TreeSelectModule,
  ],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `assets/images/${config.src}`;
      },
    },
  ],
})
export class UserManagementModule { }
