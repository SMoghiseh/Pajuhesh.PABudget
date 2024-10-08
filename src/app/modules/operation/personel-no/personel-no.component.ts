import { Component } from '@angular/core';
import {
  BudgetSourceUse,
  Company,
  CostCenterType,
  EducationTypeCode,
  EmploymentType,
  Pagination,
  Period,
  PersonelNo,
  UrlBuilder,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personel-no',
  templateUrl: './personel-no.component.html',
  styleUrls: ['./personel-no.component.scss'],
  providers: [ConfirmationService],
})
export class PersonelNoComponent {
  gridClass = 'p-datatable-sm';
  searchPersonelNoForm!: FormGroup;
  dataTableRows = 10;
  totalCount!: number;
  data: PersonelNo[] = [];
  periodLst: Period[] = [];
  periodDetailLst: Period[] = [];
  employmentTypeLst: EmploymentType[] = [];
  CostCenterLst: CostCenterType[] = [];
  educationTypeCodeLst: EducationTypeCode[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  inputData = new BudgetSourceUse();
  modalTitle = '';
  isOpenAddEditPersonelNo = false;
  addEditData = new PersonelNo();
  pId!: string;
  addEditPersonelNoModel = new PersonelNo();
  companyList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPeriodLst();
    this.getCostCenterType();
    this.getEmploymentType();
    this.getEducationTypeCode();
    this.getCompanyLst();

    this.searchPersonelNoForm = new FormGroup({
      periodId: new FormControl(this.addEditPersonelNoModel.periodId),
      periodDetailId: new FormControl(
        this.addEditPersonelNoModel.periodDetailId
      ),
      employmentTypeId: new FormControl(
        this.addEditPersonelNoModel.employmentTypeId
      ),
      costCenterTypeId: new FormControl(
        this.addEditPersonelNoModel.costCenterTypeId
      ),
      educationTypeId: new FormControl(
        this.addEditPersonelNoModel.educationTypeId
      ),
      companyId: new FormControl(null),
      gender: new FormControl(0),
    });
  }

  // getPersonelNo(event?: LazyLoadEvent) {
  //   if (event) this.lazyLoadEvent = event;

  //   const pagination = new Pagination();
  //   const first = this.lazyLoadEvent?.first || 0;
  //   const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

  //   pagination.pageNumber = first / rows + 1;
  //   pagination.pageSize = rows;

  //   const body = {
  //     pageSize: pagination.pageSize,
  //     pageNumber: pagination.pageNumber,
  //     withOutPagination: false,
  //     periodId: parseInt(this.pId),
  //   };

  //   this.loading = true;

  //   this.first = 0;
  //   const url = PersonelNo.apiAddress + 'ListByFilter';
  //   this.httpService
  //     .post<PersonelNo[]>(url, body)

  //     .pipe(
  //       tap(() => (this.loading = false)),
  //       map(response => {
  //         if (response.data && response.data.result) {
  //           if (response.data.totalCount)
  //             this.totalCount = response.data.totalCount;
  //           return response.data.result;
  //         } else return [new PersonelNo()];
  //       })
  //     )
  //     .subscribe(res => (this.data = res));
  // }
  getEmploymentType() {
    this.httpService
      .get<EmploymentType[]>(EmploymentType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.employmentTypeLst = response.data.result;
        }
      });
  }
  getEducationTypeCode() {
    this.httpService
      .get<EducationTypeCode[]>(EducationTypeCode.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.educationTypeCodeLst = response.data.result;
        }
      });
  }
  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
  getCostCenterType() {
    this.httpService
      .get<CostCenterType[]>(CostCenterType.apiAddress + 'list')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.CostCenterLst = response.data.result;
        }
      });
  }
  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodLst = response.data.result;
        }
      });
  }
  getPersonalNumberList(event?: any) {
    if (event) this.lazyLoadEvent = event;
    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.searchPersonelNoForm.value;
    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;
    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      periodId: formValue.periodId,
      periodDetailId: formValue.periodDetailId,
      employmentTypeId: formValue.employmentTypeId,
      costCenterTypeId: formValue.costCenterTypeId,
      educationTypeId: formValue.educationTypeId,
      gender: formValue.gender,
    };
    this.first = 0;
    const url = PersonelNo.apiAddress + 'ListByFilter';
    this.httpService
      .post<PersonelNo[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new PersonelNo()];
        })
      )
      .subscribe(res => (this.data = res));
  }
  clearSearch() {
    this.searchPersonelNoForm.reset();
    this.getPersonalNumberList();
  }
  addPersonelNo() {
    this.modalTitle = 'افزودن بودجه پرسنل جدید';
    this.addEditData.type = 'insert';
    this.isOpenAddEditPersonelNo = true;
  }

  editRow(data: PersonelNo) {
    this.modalTitle = 'ویرایش بودجه پرسنل ' + data.periodTitle;
    this.addEditData = data;
    this.addEditData.type = 'edit';
    this.isOpenAddEditPersonelNo = true;
  }
  onChangePeriod(e: any) {
    this.getPeriodDetailLst(e.value);
  }
  getPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodDetailLst = response.data.result;
          if (this.inputData.id)
            this.searchPersonelNoForm.patchValue({
              periodDetailId: this.inputData.periodId,
            });
        }
      });
  }
  closeModal() {
    this.isOpenAddEditPersonelNo = false;
  }
  deleteRow(period: PersonelNo) {
    if (period && period.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف بودجه پرسنل اطمینان دارید؟',
        header: `عنوان ${period.periodTitle}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.getPersonalNumberList(period.id),
      });
  }

  deletePersonelNo(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<PersonelNo>(
          UrlBuilder.build(PersonelNo.apiAddress + 'DELETE', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'personelNo',
              life: 8000,
              severity: 'success',
              detail: `بودجه پرسنل ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getPersonalNumberList();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditPersonelNo = false;
    this.getPersonalNumberList();
  }
}
