import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, tap } from 'rxjs';
import { HttpService } from '@core/http/http.service';
import {
  ChangePassword,
  DeletePerson,
  FileType,
  Pagination,
  Person,
  UrlBuilder,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';

export class SearchPerson extends Pagination {
  /** نام */
  firstName!: string;

  /** نام خانوادگی */
  lastName!: string;

  /** کد ملی */
  nationalId!: string;

  userName!: string;
}

@Component({
  selector: 'app-user-definition',
  templateUrl: './user-definition.component.html',
  styleUrls: ['./user-definition.component.scss'],
  providers: [ConfirmationService],
})
export class UserDefinitionComponent implements OnInit {
  @Output() Hide: EventEmitter<Person> = new EventEmitter();
  /** Main table total count. */
  totalCount!: number;

  /** Main table data. */
  personList: Person[] = [];

  editPersonData!: Person;

  // /** Main table data. */
  // selectedPerson = new Person();

  /** Main table loading. */
  loading = false;

  /** Main table rows */
  dataTableRows = 10;

  /** Main table first row */
  dataTableFirst = 0;

  gridClass = 'p-datatable-sm';

  /*--------------------------
  # SEARCH USER
  --------------------------*/
  /** گروه فرم جستجو کاربر */
  searchPersonForm!: FormGroup;

  /** مدل جستجو کاربر */
  searchPersonModel = new Person();

  maxlength = 3;

  patternDecimal = /^[0-9]+(\.[0-9]{1,2})?$/;

  patternText = /^[^1234567890\wertyuiopasdfghjklzxcvbnmq]+$/;

  lazyLoadEvent?: LazyLoadEvent;

  isOpenAddPerson = false;

  fullTextSearch?: string;
  pageNumber!: number;
  pageSize!: number;
  currentPage!: number;
  propertyName: string | null = null;
  isAsc!: boolean;

  /** نام */
  get searchText() {
    return this.searchPersonForm.get('firstName');
  }

  /** انتظار برای حذف کاربر */
  deletePersonFormLoading = false;

  first = 0;

  @ViewChild('dataTable') dataTable!: Table;
  @Input() type = '';

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService,
    private confirmationService: ConfirmationService
  ) {
    this.pageNumber = 1;
    this.pageSize = 10;
  }

  ngOnInit(): void {
    this.searchPersonForm = new FormGroup({
      searchText: new FormControl(this.searchPersonModel.firstName)
    });
  }

  /*--------------------------
  # GET
  --------------------------*/
  /** Get person list from server. */
  getPersonList(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;
    else this.first = 0;
    if (this.searchPersonForm.valid) {
      const { searchText } = this.searchPersonForm.value;

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
      searchModel.fullTextSearch = PersianNumberService.toEnglish(searchText);
      this.loading = true;

      this.httpService
        .post<Person[]>(Person.apiAddress, searchModel)
        .pipe(
          tap(() => (this.loading = false)),
          map(response => {
            if (response.data && response.data.totalCount != undefined)
              this.totalCount = response.data.totalCount;
            if (response.data && response.data.result)
              return response.data.result;
            return [new Person()];
          })
        )
        .subscribe(personList => (this.personList = personList));
    }
  }

  /*--------------------------
  # UPDATE
  --------------------------*/

  // /** On edit data table row.
  //  * @param person person model
  //  */
  onEdit(person: Person) {
    this.editPersonData = person;
    this.isOpenAddPerson = true;
  }

  /*--------------------------
  # DELETE
  --------------------------*/
  /**
   * On delete data table row
   * @param person person model
   */
  onDelete(person: Person) {
    if (person && person.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف کاربر اطمینان دارید؟',
        header: `کاربر ${person.firstName}`,
        icon: 'pi pi-user-minus',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePerson(person.id, person.firstName),
      });
  }

  /** Delete person */
  deletePerson(id: number, firstName: string) {
    if (id && firstName) {
      // this.editPersonFormLoading = true;

      this.httpService
        .post<DeletePerson>(`${DeletePerson.apiAddress}${id}`, '')
        .pipe(
          tap(() => {
            // this.editPersonFormLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getPersonList();
            this.dataTableFirst = 0;

            this.messageService.add({
              key: 'userDefinition',
              life: 8000,
              severity: 'success',
              detail: `کاربر ${PersianNumberService.toPersian(firstName)}`,
              summary: 'با موفقیت حذف شد',
            });

            // this.resetAddNewPersonForm();
          }
        });
    }
  }

  onResetPass(person: Person) {
    this.confirmationService.confirm({
      message: 'آیا از بازنشانی کلمه عبور اطمینان دارید؟',
      header: `کاربر ${person.firstName}`,
      icon: 'pi pi-user-minus',
      acceptLabel: 'بله',
      acceptButtonStyleClass: 'p-button-success',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'خیر',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',
      accept: () => this.resetPass(person),
    });
  }

  resetPass(person: Person) {
    const request = {
      password: person.nationalId,
      repeatPassword: person.nationalId,
      userName: person.userName,
    };

    this.httpService
      .post<FileType>(
        UrlBuilder.build(ChangePassword.apiAddressSet, ''),
        request
      )
      .subscribe(response => {
        if (response.successed && response.data && response.data.token) {
          this.messageService.add({
            key: 'userDefinition',
            life: 8000,
            severity: 'success',
            summary: 'رمز ورود با موفقیت بازنشانی شد.',
          });
        }
      });
  }

  onActivateUser(person: Person) {
    const request = {
      personId: person.id,
    };
    this.httpService
      .post<FileType>(
        UrlBuilder.build(DeletePerson.apiAddress + 'activation', ''),
        request
      )
      .subscribe(response => {
        if (response.successed) {
          this.getPersonList();
          this.messageService.add({
            key: 'userDefinition',
            life: 8000,
            severity: 'success',
            summary: 'عملیات با موفقیت انجام شد.',
          });
        }
      });
  }

  returnIcon(type: boolean): string {
    if (!type) return 'pi pi-user-plus';
    else return 'pi pi-user-minus';
  }

  onOpenAddPerson() {
    this.editPersonData = new Person();
    this.isOpenAddPerson = true;
  }

  onCloseModal() {
    this.isOpenAddPerson = false;
    this.getPersonList();
  }

  onRowDblClick(data: Person) {
    this.Hide.emit(data);
  }
}
