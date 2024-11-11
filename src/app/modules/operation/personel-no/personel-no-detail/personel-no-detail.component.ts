import { Component } from '@angular/core';
import {
  BudgetSourceUse,
  Company,
  CostCenterType,
  EducationTypeCode,
  EmploymentType,
  Pagination,
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
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'PABudget-personel-no-detail',
  templateUrl: './personel-no-detail.component.html',
  styleUrls: ['./personel-no-detail.component.scss'],
  providers: [ConfirmationService],
})
export class PersonelNoDetailComponent {
  gridClass = 'p-datatable-sm';
  searchPersonelNoForm!: FormGroup;
  dataTableRows = 10;
  totalCount!: number;
  data: PersonelNo[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  inputData = new BudgetSourceUse();
  modalTitle = '';
  // isOpenAddEditPersonelNo = false;
  addEditData = new PersonelNo();
  pId!: string;
  addEditPersonelNoModel = new PersonelNo();
  personelNoId = 0;
  isLoadingSubmit = false;
  buttonLabel = 'افزودن';

  // dropdown properties
  employmentTypeLst: EmploymentType[] = [];
  CostCenterLst: CostCenterType[] = [];
  educationTypeCodeLst: EducationTypeCode[] = [];
  companyList: any = [];
  formSubmitted = false;

  get employmentTypeId() {
    return this.searchPersonelNoForm.get('companyId');
  }
  get costCenterTypeId() {
    return this.searchPersonelNoForm.get('companyId');
  }
  get educationTypeId() {
    return this.searchPersonelNoForm.get('companyId');
  }
  get gender() {
    return this.searchPersonelNoForm.get('companyId');
  }
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCostCenterType();
    this.getEmploymentType();
    this.getEducationTypeCode();
    this.getCompanyLst();

    this.searchPersonelNoForm = new FormGroup({
      employmentTypeId: new FormControl(null, Validators.required),
      costCenterTypeId: new FormControl(null, Validators.required),
      educationTypeId: new FormControl(null, Validators.required),
      employeewageCU: new FormControl(
        this.addEditPersonelNoModel.employeewageCU
      ),
      personelCount: new FormControl(this.addEditPersonelNoModel.personelCount),
      gender: new FormControl(null, Validators.required),
    });

    this.personelNoId = Number(this.route.snapshot.paramMap.get('id'));

    this.inputData.type === 'insert';
  }

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

  getPersonalNumberList(event?: any) { debugger
    this.formSubmitted = true;
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
      employmentTypeId: formValue.employmentTypeId,
      costCenterTypeId: formValue.costCenterTypeId,
      educationTypeId: formValue.educationTypeId,
      gender: formValue.gender,
      personelNoId: this.personelNoId,
    };
    this.first = 0;
    const url = PersonelNo.apiAddressPersonelNo + 'List';
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

  addPersonalNoDetail() { debugger
    if (this.searchPersonelNoForm.valid) {
      const request: PersonelNo = this.searchPersonelNoForm.value;
      request.id = this.inputData.type === 'insert' ? 0 : this.inputData.id;
      request.personelNoId = this.personelNoId;
      this.isLoadingSubmit = true;

      this.httpService
        .post<PersonelNo>(
          PersonelNo.apiAddressPersonelNo + 'CreateOrUpdate',
          request
        )
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'personelNo',
              life: 8000,
              severity: 'success',
              detail: `جزئیات بودجه پرسنل `,
              summary:
                this.inputData.type === 'insert'
                  ? 'با موفقیت درج شد'
                  : 'با موفقیت بروزرسانی شد',
            });
            this.reloadData();
          }
        });
    }
  }

  clearSearch() {
    this.searchPersonelNoForm.reset();
    this.getPersonalNumberList();
    this.buttonLabel = 'افزودن';
  }

  editRow(data: PersonelNo) {
    this.addEditData = data;
    this.addEditData.type = 'edit';
    this.buttonLabel = 'ویرایش';
    // this.isOpenAddEditPersonelNo = true;
    this.getRowData(data.id);
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(PersonelNo.apiAddressPersonelNo + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.searchPersonelNoForm.patchValue(response.data.result);
        }
      });
  }

  closeModal() {
    // this.isOpenAddEditPersonelNo = false;
  }

  deleteRow(item: PersonelNo) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: ` آیا از حذف مرکز هزینه "${item.costCenterTypeTitle}" اطمینان دارید؟`,
        header: ` مرکز هزینه  "${item.costCenterTypeTitle}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePersonelNo(item.id, item.costCenterTypeTitle),
      });
  }

  deletePersonelNo(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<PersonelNo>(
          UrlBuilder.build(PersonelNo.apiAddressPersonelNo + 'DELETE', '') +
            `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'personelNo',
              life: 8000,
              severity: 'success',
              detail: ` بودجه پرسنل مرکز هزینه "${title}"`,
              summary: 'با موفقیت حذف شد',
            });
            this.getPersonalNumberList();
          }
        });
    }
  }

  reloadData() {
    // this.isOpenAddEditPersonelNo = false;
    this.searchPersonelNoForm.reset();
    this.getPersonalNumberList();
  }
}
