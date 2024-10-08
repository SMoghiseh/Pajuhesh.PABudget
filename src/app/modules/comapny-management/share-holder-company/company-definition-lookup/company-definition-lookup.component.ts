import {
  Component,
  OnInit,
  ViewChild, EventEmitter,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, tap } from 'rxjs';
import { HttpService } from '@core/http/http.service';
import {
  ChangePassword,
  DeletePerson,
  FileType,
  Pagination,
  ShareHolder,
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
  partyName!: string;

  /** نام خانوادگی */
  partyLastName!: string;

  /** کد ملی */
  nationalId!: string;

}

@Component({
  selector: 'PABudget-company-definition-lookup',
  templateUrl: './company-definition-lookup.component.html',
  styleUrls: ['./company-definition-lookup.component.scss'],
  providers: [ConfirmationService],

})

export class CompanyDefinitionLookupComponent implements OnInit {
  @Output() Hide: EventEmitter<ShareHolder> = new EventEmitter();
  /** Main table total count. */
  totalCount!: number;

  /** Main table data. */
  personList: ShareHolder[] = [];

  editPersonData!: ShareHolder;

  // /** Main table data. */
  // selectedPerson = new ShareHolder();

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
  searchPersonModel = new ShareHolder();

  maxlength = 3;

  patternDecimal = /^[0-9]+(\.[0-9]{1,2})?$/;

  patternText = /^[^1234567890\wertyuiopasdfghjklzxcvbnmq]+$/;

  lazyLoadEvent?: LazyLoadEvent;

  isOpenAddPerson = false;

  isOpenUserGroup = false;

  selectedPersonId!: number;

  /** نام */
  get partyName() {
    return this.searchPersonForm.get('partyName');
  }
  /** نام خانوادگی */
  get partyLastName() {
    return this.searchPersonForm.get('partyLastName');
  }
  /** کد ملی */
  get partyNationalId() {
    return this.searchPersonForm.get('nationalId');
  }

  /** انتظار برای حذف کاربر */
  deletePersonFormLoading = false;

  first = 0;

  @ViewChild('dataTable') dataTable!: Table;
  // @Input() type = '';

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.searchPersonForm = new FormGroup({
      partyName: new FormControl(this.searchPersonModel.partyName),
      partyLastName: new FormControl(this.searchPersonModel.partyLastName),
      partyNationalId: new FormControl(this.searchPersonModel.partyNationalId),
      userName: new FormControl(),
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
      const { partyName, partyLastName, partyNationalId, userName } =
        this.searchPersonForm.value;

      const searchModel = new SearchPerson();
      searchModel.partyName = PersianNumberService.toEnglish(partyName);
      searchModel.partyLastName = PersianNumberService.toEnglish(partyLastName);
      searchModel.nationalId = PersianNumberService.toEnglish(partyNationalId);

      const first = this.lazyLoadEvent?.first || 0;
      const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

      searchModel.pageNumber = first / rows + 1;
      searchModel.pageSize = rows;

      this.loading = true;

      this.httpService
        .post<ShareHolder[]>(ShareHolder.PartyListApiAddress, {
          withOutPagination: true
        }).pipe(
          tap(() => (this.loading = false)),
          map(response => {
            if (response.data && response.data.totalCount != undefined)
              this.totalCount = response.data.totalCount;
            if (response.data && response.data.result)
              return response.data.result;
            return [new ShareHolder()];
          })
        )
        .subscribe(personList => {
          debugger
          this.personList = personList;
        });
    }
  }

  /*--------------------------
  # UPDATE
  --------------------------*/

  // /** On edit data table row.
  //  * @param person person model
  //  */
  onEdit(person: ShareHolder) {
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
  onDelete(person: ShareHolder) {
    if (person && person.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف کاربر اطمینان دارید؟',
        header: `کاربر ${person.partyName}`,
        icon: 'pi pi-user-minus',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePerson(person.id, person.partyName),
      });
  }

  /** Delete person */
  deletePerson(id: number, partyName: string) {
    if (id && partyName) {
      // this.editPersonFormLoading = true;

      this.httpService
        .delete<DeletePerson>(DeletePerson.apiAddress + id + '/delete')
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
              life: 4000,
              severity: 'success',
              detail: `کاربر ${PersianNumberService.toPersian(partyName)}`,
              summary: 'با موفقیت حذف شد',
            });

            // this.resetAddNewPersonForm();
          }
        });
    }
  }

  onResetPass(person: ShareHolder) {
    this.confirmationService.confirm({
      message: 'آیا از بازنشانی کلمه عبور اطمینان دارید؟',
      header: `کاربر ${person.partyName}`,
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

  resetPass(person: ShareHolder) {
    const request = {
      // password: person.nationalId,
      // repeatPassword: person.nationalId,
      // userName: person.userName,
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
            life: 4000,
            severity: 'success',
            summary: 'رمز ورود با موفقیت بازنشانی شد.',
          });
        }
      });
  }

  onActivateUser(person: ShareHolder) {
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
            life: 4000,
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
    this.editPersonData = new ShareHolder();
    this.isOpenAddPerson = true;
  }

  onCloseModal() {
    this.isOpenAddPerson = false;
    this.getPersonList();
  }

  onRowDblClick(data: ShareHolder) {
    debugger
    this.Hide.emit(data);
  }

  onUserGroup(person: ShareHolder) {
    this.isOpenUserGroup = true;
    this.selectedPersonId = person.id;
  }
}
