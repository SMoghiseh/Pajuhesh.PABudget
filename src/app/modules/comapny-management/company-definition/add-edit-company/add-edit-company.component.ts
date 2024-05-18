import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivityType,
  Company,
  CompanyInspectionInstitute,
  CompanyTree,
  CompanyType,
  CreateCompany,
  PublisherStatus,
  ReportingType,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { DatePipe } from '@angular/common';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';

@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss'],
})
export class AddEditCompanyComponent implements OnInit {
  public datePipe = new DatePipe('en-US');
  noSpacesRegex = /^[a-zA-z_-]+$/;

  /*--------------------------
  # From
  --------------------------*/
  addNewCompanyForm!: FormGroup;
  addNewCompanyModel = new Company();
  addNewCompanySubmitted = false;
  addNewCompanyLoading = false;

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
  parents: CompanyTree[] = [];

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

  isEdit = false;
  editData: any;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set data(company: Company) {
    if (company && company.id) {
      this.isEdit = true;
      this.editData = company;
      this.addNewCompanyForm.patchValue(company);
      this.addNewCompanyForm.patchValue({
        parentId: this.parents.find(data => data.id === company.parentId),
        companyType: this.companyTypes.find(
          data => data.id === company.companyTypeId
        ),
      });
      if (typeof company.parentId == 'number')
        this.returnSelectedNode(company.parentId, this.parents, company);
      if (typeof company.registerDate === 'string') {
        this.addNewCompanyForm.patchValue({
          registerDate: new JDate(new Date(company.registerDate)),
        });
      }
      if (typeof company.periodType === 'string') {
        this.addNewCompanyForm.patchValue({
          periodType: new JDate(new Date(company.periodType)),
        });
      }
    } else {
      this.isEdit = false;
      this.addNewCompanyForm.reset();
      this.editData = new Company();
    }
  }

  get parentId() {
    return this.addNewCompanyForm.get('parentId');
  }
  get companyType() {
    return this.addNewCompanyForm.get('companyType');
  }
  get activityType() {
    return this.addNewCompanyForm.get('activityType');
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
  get isic() {
    return this.addNewCompanyForm.get('isic');
  }
  get companyISIN() {
    return this.addNewCompanyForm.get('companyISIN');
  }
  get registeredCapital() {
    return this.addNewCompanyForm.get('registeredCapital');
  }
  get nonRegisteredCapital() {
    return this.addNewCompanyForm.get('nonRegisteredCapital');
  }
  get financialManager() {
    return this.addNewCompanyForm.get('financialManager');
  }
  get periodType() {
    return this.addNewCompanyForm.get('periodType');
  }
  get reportingType() {
    return this.addNewCompanyForm.get('reportingType');
  }
  get companyInspectionInstitute() {
    return this.addNewCompanyForm.get('companyInspectionInstitute');
  }
  get systemOrganizationCode() {
    return this.addNewCompanyForm.get('systemOrganizationCode');
  }
  get fromDate() {
    return this.addNewCompanyForm.get('fromDate');
  }
  get toDate() {
    return this.addNewCompanyForm.get('toDate');
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
  get stockAffairsOffice() {
    return this.addNewCompanyForm.get('stockAffairsOffice');
  }
  get stockAffairsTelephone() {
    return this.addNewCompanyForm.get('stockAffairsTelephone');
  }
  get stockAffairsFax() {
    return this.addNewCompanyForm.get('stockAffairsFax');
  }
  get centeralOffice() {
    return this.addNewCompanyForm.get('centeralOffice');
  }
  get centeralOfficeTelephone() {
    return this.addNewCompanyForm.get('centeralOfficeTelephone');
  }
  get centeralOfficeFax() {
    return this.addNewCompanyForm.get('centeralOfficeFax');
  }
  get managingDirector() {
    return this.addNewCompanyForm.get('managingDirector');
  }
  get boardofDirectors() {
    return this.addNewCompanyForm.get('boardofDirectors');
  }
  get alternateInspector() {
    return this.addNewCompanyForm.get('alternateInspector');
  }
  get substituteInspector() {
    return this.addNewCompanyForm.get('substituteInspector');
  }
  get countOfEmployees() {
    return this.addNewCompanyForm.get('countOfEmployees');
  }
  get meetingManagementDate() {
    return this.addNewCompanyForm.get('meetingManagementDate');
  }
  get meetingManagmentNumber() {
    return this.addNewCompanyForm.get('meetingManagmentNumber');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) { }

  ngOnInit(): void {
    this.getCompanyInspectionInstitutes();
    this.getReportingTypes();
    // this.getPublisherStatuses();
    this.getCompanyTree();
    this.getCompanyTypes();
    this.getActivityTypes();
    this.addNewCompanyForm = new FormGroup({
      // parentId: new FormControl(this.addNewCompanyModel.parentId),
      companyType: new FormControl(
        this.addNewCompanyModel.companyType,
        Validators.required
      ),
      activityType: new FormControl(
        this.addNewCompanyModel.activityType,
        Validators.required
      ),
      companyName: new FormControl(
        this.addNewCompanyModel.companyName,
        Validators.required
      ),
      // latinName: new FormControl(this.addNewCompanyModel.latinName),
      nationalID: new FormControl(
        this.addNewCompanyModel.nationalID,
        Validators.required
      ),
      // symbol: new FormControl(
      //   this.addNewCompanyModel.symbol,
      //   Validators.required
      // ),
      registerDate: new FormControl(
        this.addNewCompanyModel.registerDate,
        Validators.required
      ),
      registerNumber: new FormControl(
        this.addNewCompanyModel.registerNumber,
        Validators.required
      ),
      isic: new FormControl(this.addNewCompanyModel.isic, Validators.required),
      companyISIN: new FormControl(
        this.addNewCompanyModel.companyISIN,
        Validators.required
      ),
      registeredCapital: new FormControl(
        this.addNewCompanyModel.registeredCapital,
        Validators.required
      ),
      nonRegisteredCapital: new FormControl(
        this.addNewCompanyModel.nonRegisteredCapital,
        Validators.required
      ),
      // financialManager: new FormControl(
      //   this.addNewCompanyModel.financialManager,
      //   Validators.required
      // ),
      periodType: new FormControl(
        this.addNewCompanyModel.periodType,
        Validators.required
      ),
      systemOrganizationCode: new FormControl(
        this.addNewCompanyModel.systemOrganizationCode,
        Validators.required
      ),
      fromDate: new FormControl(
        this.addNewCompanyModel.fromDate,
        Validators.required
      ),
      toDate: new FormControl(
        this.addNewCompanyModel.toDate,
        Validators.required
      ),
      percentOwner: new FormControl(
        this.addNewCompanyModel.percentOwner,
        Validators.required
      ),
      reportingType: new FormControl(
        this.addNewCompanyModel.reportingType,
        Validators.required
      ),
      companyInspectionInstitute: new FormControl(
        this.addNewCompanyModel.companyInspectionInstitute,
        Validators.required
      ),
      activitySubject: new FormControl(
        this.addNewCompanyModel.activitySubject,
        Validators.required
      ),
      factoryAddress: new FormControl(this.addNewCompanyModel.factoryAddress),
      factoryTelephone: new FormControl(
        this.addNewCompanyModel.factoryTelephone
      ),
      factoryFax: new FormControl(this.addNewCompanyModel.factoryFax),
      stockAffairsOffice: new FormControl(
        this.addNewCompanyModel.stockAffairsOffice
      ),
      stockAffairsTelephone: new FormControl(
        this.addNewCompanyModel.stockAffairsTelephone
      ),
      stockAffairsFax: new FormControl(this.addNewCompanyModel.stockAffairsFax),
      centeralOffice: new FormControl(this.addNewCompanyModel.centeralOffice),
      // centeralOfficeTelephone: new FormControl(
      //   this.addNewCompanyModel.centeralOfficeTelephone
      // ),
      // centeralOfficeFax: new FormControl(
      //   this.addNewCompanyModel.centeralOfficeFax
      // ),
      // managingDirector: new FormControl(
      //   this.addNewCompanyModel.managingDirector
      // ),
      // boardofDirectors: new FormControl(
      //   this.addNewCompanyModel.boardofDirectors
      // ),
      // alternateInspector: new FormControl(
      //   this.addNewCompanyModel.alternateInspector
      // ),
      // substituteInspector: new FormControl(
      //   this.addNewCompanyModel.substituteInspector
      // ),
      countOfEmployees: new FormControl(
        this.addNewCompanyModel.countOfEmployees
      ),
      meetingManagementDate: new FormControl(
        this.addNewCompanyModel.meetingManagementDate
      ),
      meetingManagmentNumber: new FormControl(
        this.addNewCompanyModel.meetingManagmentNumber
      ),
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
        companyType,
        activityType,
        companyName,
        latinName,
        nationalID,
        symbol,
        registerDate,
        registerNumber,
        isic,
        companyISIN,
        registeredCapital,
        nonRegisteredCapital,
        financialManager,
        periodType,
        reportingType,
        companyInspectionInstitute,
        systemOrganizationCode,
        fromDate,
        toDate,
        percentOwner,
        activitySubject,
        factoryAddress,
        factoryTelephone,
        factoryFax,
        stockAffairsOffice,
        stockAffairsTelephone,
        stockAffairsFax,
        centeralOffice,
        centeralOfficeTelephone,
        centeralOfficeFax,
        managingDirector,
        boardofDirectors,
        alternateInspector,
        substituteInspector,
        countOfEmployees,
        meetingManagementDate,
        meetingManagmentNumber
      } = this.addNewCompanyForm.value;

      const request = new Company();
      request.id = this.editData?.id;
      request.nationalID = PersianNumberService.toEnglish(nationalID);
      request.registeredCapital = registeredCapital;
      request.nonRegisteredCapital = nonRegisteredCapital;
      request.isic = isic;
      request.companyISIN = companyISIN;
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
      request.companyTypeId = companyType.id;
      request.activityType = activityType;
      request.symbol = symbol;
      request.parentId = parentId.id;
      request.latinName = latinName;
      request.periodType = periodType
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            periodType?.getFullYear(),
            periodType?.getMonth(),
            periodType?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.activitySubject = activitySubject;
      request.reportingType = reportingType;
      request.financialManager = financialManager;
      request.factoryAddress = factoryAddress;
      request.factoryTelephone = factoryTelephone;
      request.factoryFax = factoryFax;
      request.stockAffairsOffice = stockAffairsOffice;
      request.stockAffairsTelephone = stockAffairsTelephone;
      request.stockAffairsFax = stockAffairsFax;
      request.centeralOffice = centeralOffice;
      request.centeralOfficeTelephone = centeralOfficeTelephone;
      request.centeralOfficeFax = centeralOfficeFax;
      request.managingDirector = managingDirector;
      request.financialManager = financialManager;
      request.boardofDirectors = boardofDirectors;
      request.substituteInspector = substituteInspector;
      request.countOfEmployees = countOfEmployees;
      request.meetingManagementDate = meetingManagementDate;
      request.meetingManagmentNumber = meetingManagmentNumber;
      request.alternateInspector = alternateInspector;
      request.companyInspectionInstitute = companyInspectionInstitute;
      request.systemOrganizationCode = systemOrganizationCode;
      request.fromDate = fromDate;
      request.toDate = toDate;
      request.percentOwner = percentOwner;

      this.addNewCompanyLoading = true;

      this.httpService
        .post<CreateCompany>(CreateCompany.apiAddress, request)
        .pipe(tap(() => (this.addNewCompanyLoading = false)))
        .subscribe(response => {
          if (response.successed) {
            this.closeModal.emit(true);
            this.resetAddNewCompanyForm();

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
  resetAddNewCompanyForm() {
    this.addNewCompanySubmitted = false;
    this.addNewCompanyForm.reset();
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
      .get<CompanyTree[]>(CompanyTree.apiAddress)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return;
        })
      )
      .subscribe(permissions => {
        if (permissions) this.parents = permissions;
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
}
