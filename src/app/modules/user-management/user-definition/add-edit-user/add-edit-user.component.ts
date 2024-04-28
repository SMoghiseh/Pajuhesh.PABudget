import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreatePerson,
  Person,
  UpdatePerson,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { PasswordValidator } from '@shared/validators/password.validator';
import { tap } from 'rxjs';
import { HttpService } from '@core/http/http.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent implements OnInit {
  addNewPersonForm!: FormGroup;
  editPersonForm!: FormGroup;

  patternText = /^[^1234567890\wertyuiopasdfghjklzxcvbnmq]+$/;
  patternENText = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$/;

  /** مدل افزودن کاربر جدید */
  addNewPersonModel = new Person();

  /** Main table data. */
  selectedPerson = new Person();

  /** وضعیت تایید افزودن کاربر جدید */
  addNewPersonFormSubmitted = false;

  /** انتظار برای افزودن کاربر جدید*/
  addNewPersonFormLoading = false;

  /** انتظار برای ویرایش کاربر */
  editPersonFormLoading = false;

  isEdit = false;

  editData: any;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set data(val: Person) {
    if (val && val.userName) {
      this.isEdit = true;
      this.editData = val;
      this.editPersonForm.patchValue(val);
    } else {
      this.isEdit = false;
      this.editPersonForm.reset();
    }
  }

  /** نام */
  get firstName() {
    return this.editPersonForm.get('firstName');
  }
  /** نام خانوادگی */
  get lastName() {
    return this.editPersonForm.get('lastName');
  }
  /** نام پدر */
  get fatherName() {
    return this.editPersonForm.get('fatherName');
  }
  /** جنسیت */
  get genderType() {
    return this.editPersonForm.get('genderType');
  }
  /** کد ملی */
  get nationalId() {
    return this.editPersonForm.get('nationalId');
  }
  /** تاریخ تولد */
  get birthDate() {
    return this.editPersonForm.get('birthDate');
  }
  /** شماره شناسنامه */
  get birthCertificateNumber() {
    return this.editPersonForm.get('birthCertificateNumber');
  }
  /** نام کاربری */
  get userNameForm() {
    return this.addNewPersonForm.get('userNameForm');
  }
  /** رمز عبور */
  get password() {
    return this.addNewPersonForm.get('password');
  }
  /** نام کاربری */
  get rePassword() {
    return this.addNewPersonForm.get('rePassword');
  }

  /** کد پرسنلی*/
  get personelNumber() {
    return this.editPersonForm.get('personelNumber');
  }

  /** سمت شغلی*/
  get post() {
    return this.editPersonForm.get('post');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.addNewPersonForm = new FormGroup(
      {
        userNameForm: new FormControl(
          this.addNewPersonModel.userName,
          Validators.required
        ),
        password: new FormControl(this.addNewPersonModel.password, [
          Validators.required,
          Validators.minLength(8),
        ]),
        rePassword: new FormControl(this.addNewPersonModel.rePassword, [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: PasswordValidator.matchPasswords('password', 'rePassword'),
      }
    );

    this.editPersonForm = new FormGroup({
      firstName: new FormControl(
        this.addNewPersonModel.firstName,
        Validators.required
      ),
      lastName: new FormControl(
        this.addNewPersonModel.lastName,
        Validators.required
      ),
      fatherName: new FormControl(this.addNewPersonModel.fatherName),
      genderType: new FormControl(
        this.addNewPersonModel.genderType,
        Validators.required
      ),
      nationalId: new FormControl(
        this.addNewPersonModel.nationalId,
        Validators.required
      ),
      personelNumber: new FormControl(
        this.addNewPersonModel.personelNumber,
        Validators.required
      ),
      post: new FormControl(this.addNewPersonModel.post, Validators.required),
    });

    this.editPersonForm.patchValue({ genderType: 0 });
  }

  addNewPerson() {
    if (!this.isEdit) {
      this.addNewPersonFormSubmitted = true;

      if (this.addNewPersonForm.valid && this.editPersonForm.valid) {
        this.addNewPersonFormLoading = true;

        const { userNameForm, password, rePassword } =
          this.addNewPersonForm.value;

        const {
          firstName,
          lastName,
          fatherName,
          genderType,
          nationalId,
          personelNumber,
          post,
        } = this.editPersonForm.value;
        const request = new Person();
        request.firstName = PersianNumberService.toEnglish(firstName);
        request.lastName = PersianNumberService.toEnglish(lastName);
        request.fatherName = PersianNumberService.toEnglish(fatherName);
        request.genderType = genderType;
        request.nationalId = PersianNumberService.toEnglish(nationalId);
        request.userName = PersianNumberService.toEnglish(userNameForm);
        request.password = password;
        request.rePassword = rePassword;
        request.personelNumber = personelNumber;
        request.post = post;

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
                  firstName
                )} ${PersianNumberService.toPersian(lastName)}`,
                summary: 'با موفقیت درج شد',
              });

              this.resetAddNewPersonForm();
              this.closeModal.emit(true);
            }
          });
      }
    } else {
      if (this.editPersonForm.valid) {
        this.editPersonFormLoading = true;

        const {
          firstName,
          lastName,
          fatherName,
          genderType,
          nationalId,
          personelNumber,
          post,
        } = this.editPersonForm.value;

        const request = new Person();
        request.id = this.editData.id;
        request.firstName = PersianNumberService.toEnglish(firstName);
        request.lastName = PersianNumberService.toEnglish(lastName);
        request.fatherName = PersianNumberService.toEnglish(fatherName);
        request.genderType = genderType;
        request.nationalId = PersianNumberService.toEnglish(nationalId);
        request.personelNumber = personelNumber;
        request.post = post;

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
                detail: `کاربر  ${PersianNumberService.toPersian(firstName)}`,
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
    this.editPersonForm.reset();
    this.selectedPerson = new Person();
    this.editPersonForm.patchValue({
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
