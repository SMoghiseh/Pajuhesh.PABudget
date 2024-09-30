import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { AssignRole, GeneralPerson, Role, UrlBuilder } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-user-role',
  templateUrl: './add-edit-user-role.component.html',
  styleUrls: ['./add-edit-user-role.component.scss']
})
export class AddEditUserRoleComponent {

  editUserRoleForm!: FormGroup;
  addNewPersonFormSubmitted = false;
  addNewPersonFormLoading = false;
  editPersonFormLoading = false;
  assignRoleLoading = false;
  editData: any;
  users: GeneralPerson[] = [];
  roles: Role[] = [];

  @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() mode = '';


  get user() {
    return this.editUserRoleForm.get('user');
  }
  get role() {
    return this.editUserRoleForm.get('role');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getDocumentGroups();
    this.getRoles();

    this.editUserRoleForm = new FormGroup({
      user: new FormControl(
        '',
        Validators.required
      ),
      role: new FormControl(
        '',
        Validators.required
      )
    });

  }

  getDocumentGroups() {
    this.httpService
      .get<GeneralPerson[]>(GeneralPerson.apiAddress)
      .subscribe((response: any) => {
        if (response.data.result) {
          this.users = response.data.result;
        }
      });
  }

  getRoles() {
    this.httpService
      .post<Role[]>(UrlBuilder.build(Role.apiAddress, 'LIST'), {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data.result) {
          this.roles = response.data.result;
        }
      });
  }


  /*--------------------------
# Assign
--------------------------*/
  assignRoleTouser() {
    this.addNewPersonFormSubmitted = true;
    if (this.editUserRoleForm.valid) {
      this.assignRoleLoading = true;
      const {
        role,
        user,
      } = this.editUserRoleForm.value;
      this.httpService
        .post<AssignRole>(AssignRole.apiAddress, {
          roleId: role,
          userId: user,
          isMainRole: true,
        })
        .pipe(
          tap(() => {
            this.assignRoleLoading = false;
          })
        )
        .subscribe((response: any) => {
          if (response.successed) {
            this.messageService.add({
              key: 'userRoleAssignment',
              life: 8000,
              severity: 'success',
              detail: `نقش`,
              summary: 'با موفقیت تخصیص داده شد',
            });
            this.isSuccess.emit(true);
          }
        });

    }
  }
}
