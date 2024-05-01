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
        parent: this.parents.find(data => data.id === company.parentId),
        companyTypeModel: this.companyTypes.find(
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
      if (typeof company.yearEnd === 'string') {
        this.addNewCompanyForm.patchValue({
          yearEnd: new JDate(new Date(company.yearEnd)),
        });
      }
    } else {
      this.isEdit = false;
      this.addNewCompanyForm.reset();
      this.editData = new Company();
    }
  }

  get parent() {
    return this.addNewCompanyForm.get('parent');
  }
  get companyTypeModel() {
    return this.addNewCompanyForm.get('companyTypeModel');
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
  get yearEnd() {
    return this.addNewCompanyForm.get('yearEnd');
  }
  get reportingTypeId() {
    return this.addNewCompanyForm.get('reportingTypeId');
  }
  get companyInspectionInstituteId() {
    return this.addNewCompanyForm.get('companyInspectionInstituteId');
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
      parent: new FormControl(this.addNewCompanyModel.parent),
      companyTypeModel: new FormControl(
        this.addNewCompanyModel.companyTypeModel,
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
      latinName: new FormControl(this.addNewCompanyModel.latinName),
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
      financialManager: new FormControl(
        this.addNewCompanyModel.financialManager,
        Validators.required
      ),
      yearEnd: new FormControl(
        this.addNewCompanyModel.yearEnd,
        Validators.required
      ),
      reportingTypeId: new FormControl(
        this.addNewCompanyModel.reportingTypeId,
        Validators.required
      ),
      companyInspectionInstituteId: new FormControl(
        this.addNewCompanyModel.companyInspectionInstituteId,
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
      centeralOfficeTelephone: new FormControl(
        this.addNewCompanyModel.centeralOfficeTelephone
      ),
      centeralOfficeFax: new FormControl(
        this.addNewCompanyModel.centeralOfficeFax
      ),
      managingDirector: new FormControl(
        this.addNewCompanyModel.managingDirector
      ),
      boardofDirectors: new FormControl(
        this.addNewCompanyModel.boardofDirectors
      ),
      alternateInspector: new FormControl(
        this.addNewCompanyModel.alternateInspector
      ),
      substituteInspector: new FormControl(
        this.addNewCompanyModel.substituteInspector
      ),
    });
  }

  returnSelectedNode(key: number, list: any, rowData: any) {
    list.forEach((element: any) => {
      if (element.id == key) {
        rowData.parent = element;
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
        parent,
        companyTypeModel,
        activityTypeId,
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
        yearEnd,
        reportingTypeId,
        companyInspectionInstituteId,
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
      request.companyTypeId = companyTypeModel.id;
      request.activityTypeId = activityTypeId;
      request.symbol = symbol;
      request.parentId = parent.id;
      request.latinName = latinName;
      request.yearEnd = yearEnd
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            yearEnd?.getFullYear(),
            yearEnd?.getMonth(),
            yearEnd?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.activitySubject = activitySubject;
      request.reportingTypeId = reportingTypeId;
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
      request.alternateInspector = alternateInspector;
      request.companyInspectionInstituteId = companyInspectionInstituteId;

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
