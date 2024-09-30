import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreatePerson,
  Role, UrlBuilder
} from '@shared/models/response.model';
import { tap } from 'rxjs';
import { HttpService } from '@core/http/http.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss'],
})
export class AddEditRoleComponent implements OnInit {

  editRoleForm!: FormGroup;
  patternText = /^[^1234567890\wertyuiopasdfghjklzxcvbnmq]+$/;
  patternENText = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$/;


  /** وضعیت تایید افزودن کاربر جدید */
  addNewPersonFormSubmitted = false;

  /** انتظار برای افزودن کاربر جدید*/
  addNewPersonFormLoading = false;

  /** انتظار برای ویرایش کاربر */
  editPersonFormLoading = false;

  editData: any;

  @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set data1(val: Role) {
    this.editData = val;
  }
  @Input() mode = '';

  /** نام نقش */
  get name() {
    return this.editRoleForm.get('name');
  }
  /**  شرح */
  get title() {
    return this.editRoleForm.get('title');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.editRoleForm = new FormGroup({
      name: new FormControl(
        '',
        Validators.required
      ),
      title: new FormControl(
        '',
        Validators.required
      )
    });
    if (this.mode === 'edit') {
      this.editRoleForm.patchValue(this.editData);
    }
  }

  addNewPerson() {
    this.addNewPersonFormSubmitted = true;
    if (this.editRoleForm.valid) {
      this.addNewPersonFormLoading = true;

      const {
        name,
        title,
      } = this.editRoleForm.value;
      const request = new Role();
      request.id = this.mode === 'insert' ? 0 :
        this.editData.id;
      request.name = name;
      request.title = title;

      let url = UrlBuilder.build(Role.apiAddress, 'CREATE');

      this.httpService
        .post<CreatePerson>(url, request)
        .pipe(
          tap(() => {
            this.addNewPersonFormLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'roleDefinition',
              life: 8000,
              severity: 'success',
              detail: `نقش ${name} ${title}`,
              summary: this.mode === 'insert'
                ? 'با موفقیت درج شد'
                : 'با موفقیت بروزرسانی شد',
            });

            this.isSuccess.emit(true);
          }
        });
    }
  }

}
