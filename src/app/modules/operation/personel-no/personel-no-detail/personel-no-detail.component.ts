import { Component } from '@angular/core';
import {
  AccountReportToItem,
  AttachmentType,
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
import { map, of, tap } from 'rxjs';
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
  btnDis = true;
  // dropdown properties
  employmentTypeLst: EmploymentType[] = [];
  CostCenterLst: CostCenterType[] = [];
  educationTypeCodeLst: EducationTypeCode[] = [];
  companyList: any = [];
  formSubmitted = false;
  uploadFile: any;
  personalNoExcelFile: any;
  personalNoUploadlFile: any;
  get employmentTypeId() {
    return this.searchPersonelNoForm.get('employmentTypeId');
  }
  get costCenterTypeId() {
    return this.searchPersonelNoForm.get('costCenterTypeId');
  }
  get educationTypeId() {
    return this.searchPersonelNoForm.get('educationTypeId');
  }
  get gender() {
    return this.searchPersonelNoForm.get('gender');
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
      employmentTypeId: new FormControl(
        this.addEditPersonelNoModel.employmentTypeId,
        Validators.required
      ),
      costCenterTypeId: new FormControl(
        this.addEditPersonelNoModel.costCenterTypeId,
        Validators.required
      ),
      educationTypeId: new FormControl(
        this.addEditPersonelNoModel.educationTypeId,
        Validators.required
      ),
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
  onSelectAttachment(files: FileList) {
    const File = files[0].name;
    if (files.length) {
      Array.from(files).forEach(file => {
        const data = new FormData();
        data.append('File', file);

        if (file.size <= 25000000)
          return this.httpService
            .post<any>(AttachmentType.apiAddressUpload, data)
            .subscribe(response => {
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'attachmentTypeDefinition',
                  life: 8000,
                  severity: 'success',
                  summary: 'فایل با موفقیت بارگذاری شد',
                });
                // this.accountReportPriceForm.patchValue({
                //   tempPath: fileName,
                // });
                this.uploadFile = response.data.result.multiMediaId;
                this.readPersonalNoFile(this.uploadFile);
              }
            });
        else return of();
      });
    }
  }

  readPersonalNoFile(multiMediaIdId: number) {
    const body = {
      personelNoId: this.personelNoId,
      multiMediaId: multiMediaIdId,
    };
    const url =
      PersonelNo.apiAddressPersonelNoFile +
      'UploadCompletedPersonnelNoDetailFile';
    this.httpService.post<PersonelNo[]>(url, body).subscribe(response => {
      if (response.data && response.data.result) {
        this.personalNoUploadlFile = response.data.result;
        this.getPersonalNumberList();
      }
      // this.changeList = [];
      // for (let i = 0; i < this.flattenList.length; i++) {
      //   //
      //   if (
      //     this.flattenList[i].accountRepItemId ===
      //     this.priceAccountRepToItemFromExcelFile[i].accountRepItemId
      //   ) {
      //     this.accountReportItemList.body[i].data.priceCu =
      //       this.priceAccountRepToItemFromExcelFile[i].priceCu;
      //     this.changeList.push({
      //       accountRepItemId:
      //         this.priceAccountRepToItemFromExcelFile[i].accountRepItemId,
      //       priceCu: this.priceAccountRepToItemFromExcelFile[i].priceCu,

      // groupId: item.parentId ? item.parentId : item.id
    });
    // this.flattenList[i].priceCu =
    //   this.priceAccountRepToItemFromExcelFile[i].priceCu;
  }

  downloadExcelFile() {
    if (this.searchPersonelNoForm.valid) {
      const formValue = this.searchPersonelNoForm.value;
      const body = {
        personelNoId: this.personelNoId,
        employmentTypeId: formValue.employmentTypeId,
        costCenterTypeId: formValue.costCenterTypeId,
        gender: formValue.gender,
        educationTypeId: formValue.educationTypeId,
      };
      const url =
        PersonelNo.apiAddressPersonelNoFile +
        'DownloadPersonelNoSampleExcelFile';
      this.httpService.post<PersonelNo>(url, body).subscribe(res => {
        if (res.successed) {
          const a = document.createElement('a'); //Create <a>
          a.href = 'data:application/octet-stream;base64,' + res.data.result; //Image Base64 Goes here
          a.download = res.data.fileName || ''; //File name Here
          a.click(); //Downloaded file
        }
      });
    }
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

  searchPersonalNumberList(event?: any) {
    this.formSubmitted = true;
    if (!this.searchPersonelNoForm.valid) return;
    else this.getPersonalNumberList(event);
    this.btnDis = false;
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

  addPersonalNoDetail() {
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
    this.formSubmitted = false;
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
