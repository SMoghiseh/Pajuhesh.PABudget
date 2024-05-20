import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreatePerson,
  Role,
  UpdatePerson,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { tap } from 'rxjs';
import { HttpService } from '@core/http/http.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss'],
})
export class AddEditRoleComponent implements OnInit {
  addNewPersonForm!: FormGroup;
  editRoleForm!: FormGroup;

  patternText = /^[^1234567890\wertyuiopasdfghjklzxcvbnmq]+$/;
  patternENText = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$/;

  /** مدل افزودن کاربر جدید */
  addNewPersonModel = new Role();

  /** Main table data. */
  selectedPerson = new Role();

  /** وضعیت تایید افزودن کاربر جدید */
  addNewPersonFormSubmitted = false;

  /** انتظار برای افزودن کاربر جدید*/
  addNewPersonFormLoading = false;

  /** انتظار برای ویرایش کاربر */
  editPersonFormLoading = false;

  isEdit = false;

  editData: any;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set data(val: Role) {
    if (val && val.title) {
      this.isEdit = true;
      this.editData = val;
      this.editRoleForm.patchValue(val);
    } else {
      this.isEdit = false;
      this.editRoleForm.reset();
    }
  }

  @Input() set data1(val: Role) {
    if (val && val.title) {
      this.isEdit = true;
      this.editData = val;
      this.editRoleForm.patchValue(val);
    } else {
      this.isEdit = false;
      this.editRoleForm.reset();
    }
  }

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
        this.addNewPersonModel.name,
        Validators.required
      ),
      title: new FormControl(
        this.addNewPersonModel.title,
        Validators.required
      )
    });
  }

  addNewPerson() {
    if (!this.isEdit) {
      this.addNewPersonFormSubmitted = true;

      if (this.addNewPersonForm.valid && this.editRoleForm.valid) {
        this.addNewPersonFormLoading = true;

        const { userNameForm, password, rePassword } =
          this.addNewPersonForm.value;

        const {
          name,
          title,
        } = this.editRoleForm.value;
        const request = new Role();
        request.name = name;
        request.title = title;


        this.httpService
          .post<CreatePerson>(CreatePerson.apiAddress, request)
          .pipe(
            tap(() => {
              this.addNewPersonFormLoading = false;
            })
          )
          .subscribe(response => {
            if (response.successed) {
              this.messageService.add({
                key: 'userDefinition',
                life: 8000,
                severity: 'success',
                detail: `کاربر ${PersianNumberService.toPersian(
                  name
                )} ${PersianNumberService.toPersian(title)}`,
                summary: 'با موفقیت درج شد',
              });

              this.resetAddNewPersonForm();
              this.closeModal.emit(true);
            }
          });
      }
    } else {
      if (this.editRoleForm.valid) {
        this.editPersonFormLoading = true;

        const {
          name,
          title
        } = this.editRoleForm.value;

        const request = new Role();
        request.id = this.editData.id;
        request.name = name;
        request.title = title;

        this.httpService
          .put<UpdatePerson>(UpdatePerson.apiAddress, request)
          .pipe(
            tap(() => {
              this.editPersonFormLoading = false;
            })
          )
          .subscribe(response => {
            if (response.successed) {
              this.messageService.add({
                key: 'userDefinition',
                life: 8000,
                severity: 'success',
                detail: `کاربر  ${PersianNumberService.toPersian(name)}`,
                summary: 'با موفقیت ویرایش شد',
              });

              this.resetAddNewPersonForm();
              this.closeModal.emit(true);
            }
          });
      }
    }
  }

  resetAddNewPersonForm() {
    this.addNewPersonFormSubmitted = false;
    this.addNewPersonForm.reset();
    this.editRoleForm.reset();
    this.selectedPerson = new Role();
    this.editRoleForm.patchValue({
      genderType: 0,
    });

    /** Add user panel validation */
    this.addNewPersonForm
      .get('userNameForm')
      ?.setValidators(Validators.required);
    this.addNewPersonForm.get('userNameForm')?.updateValueAndValidity();

    this.addNewPersonForm
      .get('passwored')
      ?.setValidators([Validators.required, Validators.minLength(8)]);
    this.addNewPersonForm.get('password')?.updateValueAndValidity();

    this.addNewPersonForm
      .get('rePassword')
      ?.setValidators([Validators.required, Validators.minLength(8)]);
    this.addNewPersonForm.get('rePassword')?.updateValueAndValidity();
  }
}
