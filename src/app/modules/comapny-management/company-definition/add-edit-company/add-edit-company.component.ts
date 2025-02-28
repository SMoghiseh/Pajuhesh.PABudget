import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivityType,
  AssetAttachment,
  Company,
  CompanyInspectionInstitute,
  CompanyType,
  CreateCompany,
  FiscalYear,
  ListCompany,
  PeriodType,
  PublisherStatus,
  ReportingType,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { MessageService } from 'primeng/api';
import { map, of, tap } from 'rxjs';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { DatePipe } from '@angular/common';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '@core/services/app-config.service';
import { JDate } from '@shared/utilities/JDate/jdate';
export class sharedHolder {
  id = 1;
  percentOwner: any;
  meetingNo: any;
  meetingDate: any;
}
@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss'],
})
export class AddEditCompanyComponent implements OnInit {
  public datePipe = new DatePipe('en-US');
  noSpacesRegex = /[A-Za-z ]/g;
  formHeader = '';
  buttonLabel = '';
  /*--------------------------
  # From
  --------------------------*/
  addNewCompanyForm!: FormGroup;
  sharedHoldersForm!: FormGroup;
  sharedHoldersArrayList: sharedHolder[] = [];
  addNewCompanyModel = new Company();
  addNewCompanySubmitted = false;
  addNewCompanyLoading = false;
  fiscalYearList: any = [];

  /*--------------------------
  # companyInspectionInstitutes
  --------------------------*/
  /** موسسه حسابرسی شرکت */
  companyInspectionInstitutes: CompanyInspectionInstitute[] = [];

  /*--------------------------
  # ReportingType
  --------------------------*/
  reportingTypes: ReportingType[] = [];

  /*--------------------------
  # PublisherStatus
  --------------------------*/
  financialStatuses: PublisherStatus[] = [];

  /*--------------------------
  # Parents
  --------------------------*/
  parents: Company[] = [];

  /*--------------------------
  # CompanyType
  --------------------------*/
  /** نوع‌های شرکت  */
  companyTypes: CompanyType[] = [];

  /*--------------------------
  # ActivityType
  --------------------------*/
  /** نوع‌های فعالبت  */
  activityTypes: ActivityType[] = [];
  periodTypes: any[] = [];
  companySelected: Company = new Company();
  parentCompanySelected: Company = new Company();
  first = 0;
  isDisableaddAmendmentBtn = false;
  partyLogo = 0;

  /*--------------------------
  # TABLE
  --------------------------*/
  /** Table data total count. */
  totalCount!: number;

  /** Main table loading. */
  loading = false;
  /** Main table rows */
  dataTableRows = 10;

  gridClass = 'p-datatable-sm';

  get parentId() {
    return this.addNewCompanyForm.get('parentId');
  }
  get companyTypeId() {
    return this.addNewCompanyForm.get('companyTypeId');
  }
  get activityTypeId() {
    return this.addNewCompanyForm.get('activityTypeId');
  }
  get companyName() {
    return this.addNewCompanyForm.get('companyName');
  }
  get latinName() {
    return this.addNewCompanyForm.get('latinName');
  }
  get nationalID() {
    return this.addNewCompanyForm.get('nationalID');
  }
  get symbol() {
    return this.addNewCompanyForm.get('symbol');
  }
  get registerDate() {
    return this.addNewCompanyForm.get('registerDate');
  }
  get registerNumber() {
    return this.addNewCompanyForm.get('registerNumber');
  }
  get registeredCapital() {
    return this.addNewCompanyForm.get('registeredCapital');
  }
  get startFiscalYearId() {
    return this.addNewCompanyForm.get('startFiscalYearId');
  }
  get reportingTypeId() {
    return this.addNewCompanyForm.get('reportingTypeId');
  }
  get companyInspectionInstituteId() {
    return this.addNewCompanyForm.get('companyInspectionInstituteId');
  }
  get systemOrganizationCode() {
    return this.addNewCompanyForm.get('systemOrganizationCode');
  }
  get percentOwner() {
    return this.addNewCompanyForm.get('percentOwner');
  }
  get activitySubject() {
    return this.addNewCompanyForm.get('activitySubject');
  }
  get factoryAddress() {
    return this.addNewCompanyForm.get('factoryAddress');
  }
  get factoryTelephone() {
    return this.addNewCompanyForm.get('factoryTelephone');
  }
  get factoryFax() {
    return this.addNewCompanyForm.get('factoryFax');
  }
  // get stockAffairsOffice() {
  //   return this.addNewCompanyForm.get('stockAffairsOffice');
  // }
  // get stockAffairsTelephone() {
  //   return this.addNewCompanyForm.get('stockAffairsTelephone');
  // }
  // get stockAffairsFax() {
  //   return this.addNewCompanyForm.get('stockAffairsFax');
  // }
  get centeralOffice() {
    return this.addNewCompanyForm.get('centeralOffice');
  }
  get centeralOfficeTelephone() {
    return this.addNewCompanyForm.get('centeralOfficeTelephone');
  }
  get centeralOfficeFax() {
    return this.addNewCompanyForm.get('centeralOfficeFax');
  }
  get meetingDate() {
    return this.addNewCompanyForm.get('meetingDate');
  }
  get meetingNo() {
    return this.addNewCompanyForm.get('meetingNo');
  }

  // get auditStart() {
  //   return this.addNewCompanyForm.get('auditStart');
  // }
  // get auditEnd() {
  //   return this.addNewCompanyForm.get('auditEnd');
  // }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService,
    private route: ActivatedRoute,
    private config: AppConfigService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDropDownData();
    this.createForm();
    this.setComponentMode();
  }

  getDropDownData() {
    this.getFiscalYearLst();
    this.getCompanyInspectionInstitutes();
    this.getReportingTypes();
    this.getCompanyTree();
    this.getCompanyTypes();
    this.getActivityTypes();
    this.getPeriodTypes();
  }

  createForm() {
    this.addNewCompanyForm = new FormGroup({
      parentId: new FormControl(this.addNewCompanyModel.parentId),
      companyTypeId: new FormControl(
        this.addNewCompanyModel.companyTypeId,
        Validators.required
      ),
      activityTypeId: new FormControl(
        this.addNewCompanyModel.activityTypeId,
        Validators.required
      ),
      companyName: new FormControl(
        this.addNewCompanyModel.companyName,
        Validators.required
      ),
      latinName: new FormControl(
        this.addNewCompanyModel.latinName,
        Validators.required
      ),
      nationalID: new FormControl(
        this.addNewCompanyModel.nationalID,
        Validators.required
      ),
      symbol: new FormControl(
        this.addNewCompanyModel.symbol,
        Validators.required
      ),
      registerDate: new FormControl(
        this.addNewCompanyModel.registerDate,
        Validators.required
      ),
      registerNumber: new FormControl(
        this.addNewCompanyModel.registerNumber,
        Validators.required
      ),
      registeredCapital: new FormControl(
        this.addNewCompanyModel.registeredCapital,
        Validators.required
      ),
      startFiscalYearId: new FormControl(
        this.addNewCompanyModel.startFiscalYearId,
        Validators.required
      ),
      systemOrganizationCode: new FormControl(
        this.addNewCompanyModel.systemOrganizationCode
      ),
      reportingTypeId: new FormControl(
        this.addNewCompanyModel.reportingTypeId,
        Validators.required
      ),
      companyInspectionInstituteId: new FormControl(
        this.addNewCompanyModel.companyInspectionInstituteId,
        Validators.required
      ),
      activitySubject: new FormControl(this.addNewCompanyModel.activitySubject),
      factoryAddress: new FormControl(this.addNewCompanyModel.factoryAddress),
      factoryTelephone: new FormControl(
        this.addNewCompanyModel.factoryTelephone
      ),
      factoryFax: new FormControl(this.addNewCompanyModel.factoryFax),
      // stockAffairsOffice: new FormControl(
      //   this.addNewCompanyModel.stockAffairsOffice
      // ),
      // stockAffairsTelephone: new FormControl(
      //   this.addNewCompanyModel.stockAffairsTelephone
      // ),
      // stockAffairsFax: new FormControl(this.addNewCompanyModel.stockAffairsFax),
      centeralOffice: new FormControl(this.addNewCompanyModel.centeralOffice),
      centeralOfficeTelephone: new FormControl(
        this.addNewCompanyModel.centeralOfficeTelephone
      ),
      centeralOfficeFax: new FormControl(
        this.addNewCompanyModel.centeralOfficeFax
      ),
      // auditStart: new FormControl(this.addNewCompanyModel.auditStart),
      // auditEnd: new FormControl(this.addNewCompanyModel.auditEnd),
    });

    this.sharedHoldersForm = new FormGroup({
      id: new FormControl(0),
      percentOwner: new FormControl(),
      meetingNo: new FormControl(),
      meetingDate: new FormControl(),
    });
  }

  getFiscalYearLst() {
    this.httpService
      .get<FiscalYear[]>(
        FiscalYear.apiAddress + 'List'
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.fiscalYearList = response.data.result;
        }
      });
  }

  setComponentMode() {
    this.route.queryParams.subscribe(params => {
      // component is in edit mode
      if (params.hasOwnProperty('companyId')) {
        this.companySelected.id = params['companyId'];
        // get data of comoany selected
        this.getSelectedCompanyData(this.companySelected.id);
        this.formHeader = 'ویرایش سازمان';
        this.buttonLabel = 'ویرایش';
      }

      // component is in insert mode
      else if (params.hasOwnProperty('parentId')) {
        this.parentCompanySelected.id = params['parentId'];
        // get parent data of comoany selected
        this.getParentSelectedCompanyData(this.parentCompanySelected.id);
        this.formHeader = 'افزودن سازمان';
        this.buttonLabel = 'ثبت';
      } else {
        console.log('mode is not defined!');
      }
    });
  }

  getParentSelectedCompanyData(id: number) {
    this.httpService
      .get<Company>(`${Company.apiAddressDetailCo}${id}`)
      .subscribe(response => {
        if (response.data.result) {
          this.parentCompanySelected = response.data.result;
          this.addNewCompanyForm.patchValue({
            parentId: this.parentCompanySelected.id,
          });
        }
      });
  }

  getSelectedCompanyData(id: number) {
    this.httpService
      .get<Company>(`${Company.apiAddressDetailCo}${id}`)
      .subscribe(response => {
        if (response.data.result) {
          this.companySelected = response.data.result;
          this.addNewCompanyForm.patchValue(this.companySelected);
          this.addNewCompanyForm.patchValue({
            registerDate: new JDate(
              new Date(this.companySelected.registerDate)
            ),
          });
        }
      });
  }

  returnSelectedNode(key: number, list: any, rowData: any) {
    list.forEach((element: any) => {
      if (element.id == key) {
        rowData.parentId = element;
        this.addNewCompanyForm.patchValue(rowData);
        return;
      } else if (element.children?.length > 0) {
        this.returnSelectedNode(key, element.children, rowData);
      } else return;
    });
  }

  /*--------------------------
  # CREATE
  --------------------------*/
  addNewCompany() {
    this.addNewCompanySubmitted = true;
    if (this.addNewCompanyForm.valid) {
      const {
        parentId,
        companyTypeId,
        activityTypeId,
        companyName,
        latinName,
        nationalID,
        symbol,
        registerDate,
        registerNumber,
        registeredCapital,
        startFiscalYearId,
        reportingTypeId,
        companyInspectionInstituteId,
        systemOrganizationCode,
        activitySubject,
        factoryAddress,
        factoryTelephone,
        factoryFax,
        // stockAffairsOffice,
        // stockAffairsTelephone,
        // stockAffairsFax,
        centeralOffice,
        centeralOfficeTelephone,
        centeralOfficeFax,
        // auditStart,
        // auditEnd,
      } = this.addNewCompanyForm.value;

      const request = new Company();
      request.id = this.companySelected?.id;
      request.nationalID = PersianNumberService.toEnglish(nationalID);
      request.registeredCapital = registeredCapital;
      request.companyName = companyName;
      request.registerNumber = registerNumber;
      request.registerDate = registerDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            registerDate?.getFullYear(),
            registerDate?.getMonth(),
            registerDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.startFiscalYearId = startFiscalYearId;
      request.companyTypeId = companyTypeId;
      request.activityTypeId = activityTypeId;
      request.symbol = symbol;
      request.parentId = parentId;
      request.latinName = latinName;
      request.activitySubject = activitySubject;
      request.reportingTypeId = reportingTypeId;
      request.factoryAddress = factoryAddress;
      request.factoryTelephone = factoryTelephone;
      request.factoryFax = factoryFax;
      // request.stockAffairsOffice = stockAffairsOffice;
      // request.stockAffairsTelephone = stockAffairsTelephone;
      // request.stockAffairsFax = stockAffairsFax;
      request.centeralOffice = centeralOffice;
      request.centeralOfficeTelephone = centeralOfficeTelephone;
      request.centeralOfficeFax = centeralOfficeFax;
      // request.auditStart = auditStart
      //   ? this.datePipe.transform(
      //       this.jDateCalculatorService.convertToGeorgian(
      //         auditStart?.getFullYear(),
      //         auditStart?.getMonth(),
      //         auditStart?.getDate()
      //       ),
      //       'yyyy-MM-ddTHH:mm:ss'
      //     )
      //   : null;
      // request.auditEnd = auditEnd
      //   ? this.datePipe.transform(
      //       this.jDateCalculatorService.convertToGeorgian(
      //         auditEnd?.getFullYear(),
      //         auditEnd?.getMonth(),
      //         auditEnd?.getDate()
      //       ),
      //       'yyyy-MM-ddTHH:mm:ss'
      //     )
      //   : null;
      request.companyInspectionInstituteId = companyInspectionInstituteId;
      request.systemOrganizationCode = systemOrganizationCode;
      request.multiMediaId = this.partyLogo == 0 ? 0 : this.partyLogo;
      request.shareHolders = this.sharedHoldersArrayList;
      this.addNewCompanyLoading = true;

      this.httpService
        .post<CreateCompany>(CreateCompany.apiAddress, request)
        .pipe(tap(() => (this.addNewCompanyLoading = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'companyDefinition',
              life: 8000,
              severity: 'success',
              detail: `اطلاعات شرکت`,
              summary: 'با موفقیت درج شد',
            });
          }
        });
    }
  }

  onBack() {
    this.router.navigate(['/Comapny/createCompany']);
  }

  /*--------------------------
  # CompanyInspectionInstitute
  --------------------------*/
  getCompanyInspectionInstitutes() {
    this.httpService
      .get<CompanyInspectionInstitute[]>(
        `${CompanyInspectionInstitute.apiAddress}/` + 'LIST'
      )
      .subscribe(response => {
        if (response.data.result) {
          this.companyInspectionInstitutes = response.data.result;
        }
      });
  }

  /*--------------------------
  # ReportingType
  --------------------------*/
  getReportingTypes() {
    this.httpService
      .get<ReportingType[]>(`${ReportingType.apiAddress}/` + 'LIST')
      .subscribe(response => {
        if (response.data.result) {
          this.reportingTypes = response.data.result;
        }
      });
  }

  /*--------------------------
  # PublisherStatus
  --------------------------*/
  getPublisherStatuses() {
    this.httpService
      .get<PublisherStatus[]>(`${PublisherStatus.apiAddress}/` + 'LIST')
      .subscribe(response => {
        if (response.data.result) {
          this.financialStatuses = response.data.result;
        }
      });
  }

  getCompanyTree() {
    this.httpService
      .post<Company[]>(ListCompany.apiAddress, { withOutPagination: true })
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return;
        })
      )
      .subscribe(data => {
        if (data) this.parents = data;
      });
  }

  /*--------------------------
  # CompanyType
  --------------------------*/
  getCompanyTypes() {
    this.httpService
      .get<CompanyType[]>(`${CompanyType.apiAddress}/` + 'LIST')
      .subscribe(response => {
        if (response.data.result) {
          this.companyTypes = response.data.result;
        }
      });
  }

  /*--------------------------
  # ActivityType
  --------------------------*/
  getActivityTypes() {
    this.httpService
      .get<ActivityType[]>(`${ActivityType.apiAddress}/` + 'LIST')
      .subscribe(response => {
        if (response.data.result) {
          this.activityTypes = response.data.result;
        }
      });
  }
  /*--------------------------
  # PeriodType
  --------------------------*/
  getPeriodTypes() {
    this.httpService
      .get<PeriodType[]>(`${PeriodType.apiAddress}/` + 'LIST')
      .subscribe(response => {
        if (response.data.result) {
          this.periodTypes = response.data.result;
        }
      });
  }

  addNewsharedHolders() {
    const formValue: sharedHolder = this.sharedHoldersForm.value;

    if (
      !(formValue.meetingDate || formValue.meetingNo || formValue.percentOwner)
    )
      return;

    // add id to each row
    if (this.sharedHoldersArrayList?.length != 0) {
      formValue.id =
        this.sharedHoldersArrayList[this.sharedHoldersArrayList?.length - 1]
          .id + 1;
    }
    // convert date
    formValue['meetingDate'] = formValue['meetingDate']
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          formValue['meetingDate']?.getFullYear(),
          formValue['meetingDate']?.getMonth(),
          formValue['meetingDate']?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;
    this.sharedHoldersArrayList.push(formValue);
    this.sharedHoldersForm.reset();
  }

  deleteRow(item: any) {
    const index = this.sharedHoldersArrayList.findIndex(n => n.id == item.id);
    if (index > -1) this.sharedHoldersArrayList.splice(index, 1);
  }

  uploadAttachment(files: FileList, form: any) {
    const fileName = files[0]?.name;
    if (files.length) {
      Array.from(files).forEach(file => {
        const data = new FormData();
        data.append('File', file);

        if (file.size <= 25000000)
          return this.httpService
            .post<any>(AssetAttachment.apiAddress, data)
            .subscribe(response => {
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'uploadFile',
                  life: 8000,
                  severity: 'success',
                  summary: 'فایل با موفقیت بارگذاری شد',
                });
                this.partyLogo = response.data.result.multiMediaId;
              }
            });
        else return of();
      });
    }
    // }
    form.clear();
  }

  downloadAttachmnet(attachment: number) {
    const url =
      this.config.getAddress('baseUrl') +
      AssetAttachment.downloadApiAddress +
      `/${attachment}`;

    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  removePreviousLogo() {
    this.companySelected.multiMediaId = 0;
    this.companySelected.partyLogo = '';
  }
}
