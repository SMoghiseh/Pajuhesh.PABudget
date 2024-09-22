export class UrlBuilder {
  static build(url: string, actionType: ActionType) {
    switch (actionType) {
      case 'LIST':
        return url + '/list';
      case 'CREATE':
        return url + '/create';
      case 'ADD':
        return url + '/add';
      case 'UPDATE':
        return url + '/update';
      case 'EDIT':
        return url + '/edit';
      case 'DELETE':
        return url + '/delete';
      case 'REMOVE':
        return url + '/remove';
      case 'ATTACHMENTS':
        return url + '/attachments';
      case 'DOWNLOAD':
        return url + '/download';
      case 'APPROVE':
        return url + '/approve';
      case 'REJECT':
        return url + '/reject';
      case 'DETAIL':
        return url + '/slave/list';
      case 'SEARCH':
        return url + '/search';
      case 'AMENDMENT':
        return url + '/amendment';
      case 'TREE':
        return url + '/tree';
      case '':
        return url + '';
      case 'REFFER':
        return url + '/reffer';
      case 'PUT':
        return url + '/put';
      default:
        return url + '/list';
    }
  }
}

export type ActionType =
  | 'LIST'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ATTACHMENTS'
  | 'DOWNLOAD'
  | 'APPROVE'
  | 'REJECT'
  | 'DETAIL'
  | 'AMENDMENT'
  | 'SEARCH'
  | 'ADD'
  | 'EDIT'
  | 'REMOVE'
  | 'TREE'
  | 'REFFER'
  | 'PUT'
  | '';

/** اطلاعات صفحه بندی */
export class Pagination {
  /** شماره صفحه مورد نظر */
  pageNumber!: number;

  /** تعداد ردیف مورد درخواست در صفحه */
  pageSize!: number;

  withOutPagination!: boolean;
}

/** حالت پیش فرض جواب  */
export class BaseResponse<type> {
  /** وضعیت انجام عملیات */
  successed!: boolean;

  /** متن خظا در صورت انجام نشدن عمیات */
  message!: string;

  /** کد خظا در صورت انجام نشدن عمیات */
  errorCode!: number;

  /** نتیجه عملیات */
  data!: {
    headers: Profile[];
    /** فهرست فیلدها */
    result?: type;

    res?: type;

    /** توکن*/
    token?: string;

    /** تعداد کل اطلاعات */
    totalCount?: number;

    permision?: type;

    workFlowReportData?: any;

    byCompanyGroup?: [any];

    afd?: [any];

    hasAccessAll?: boolean;
  };
}

/** ورود */
export class Account {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/Account';
}

export class RolePermissions {
  /** آدرس سرویس */
  static readonly apiAddress: string = 'api/SsoApi/Role/AllRolePermissionsTree';

  id!: number;
  data!: string;
  hasPermission!: boolean;
  icon!: string;
  label!: string;
  children?: RolePermissions[];
  underCons?: boolean;
  isHidden?: boolean;
}

export class Permission extends RolePermissions {
  /** آدرس سرویس */
  // static override readonly apiAddress: string = 'api/SsoApi/Role/permissions';
  static override readonly apiAddress: string =
    'api/SsoApi/SsoAdmin/permissions';
}

export class AllRoleDocumentTypeTree extends RolePermissions {
  static readonly apiAddress1 =
    'api/PABudgetApi/v1/role/AllRoleDocumentTypeTree';
}

/** کاربرها */
export class CreateRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/SsoAdmin/role/create';
}

/** نقش‌ها */
export class Role {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/SsoAdmin/Role';
  static readonly deleteApiAddress = 'api/SsoApi/SsoAdmin/Role/Remove/';

  /** شناسه */
  id!: number;

  /** شرح */
  title!: string;

  /** کد */
  name!: string;

  isNeedCompany!: boolean;
}
export class Group extends Pagination {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/GroupPolicy/Group';

  static readonly apiAddressUserGroups =
    'api/PABudgetApi/v1/GroupPolicy/UserGroups';

  /** شناسه */
  id!: number;

  /** شرح */
  title!: string;

  /** نام لاتین */
  parentCompanyAccess!: boolean;

  rootCompanyAccess!: boolean;

  childCompanyAccess!: boolean;

  groupId!: number;
}

/** اسناد‌ها */
export class Report extends Pagination {
  /** آدرس سرویس */
  static readonly apiAddress: string = 'api/PABudgetApi/v1/FinancialExpert';
  static readonly apiAddressSearch: string =
    'api/PABudgetApi/v1/FinancialExpert/search';

  /** شناسه */
  id!: number;

  /** کد */
  code!: number | null;

  /** عنوان */
  description!: string;

  /** زمان ارسال */
  sendDate!: any;
  sendDatePersian!: Date;

  /** زمان انتشار */
  publishDate!: Date;

  /** حسابرسی شده */
  audited!: boolean;

  /** سال منتهی به */
  yearEnding!: Date;

  /** طول دوره */
  courseLength!: number;

  /** شماره پیگیری */
  issueTrackingNo!: number | null;

  /** وضعیت اسناد */
  docStatus!: boolean | null | number;

  /** دلیل اسناد */
  amendmentReason!: boolean | null;

  /** دارای اصلاحیه */
  hasAmendment!: boolean;

  /** گروه */
  docTypeCodeGroup!: string;

  /** نوع */
  docTypeCodeTypeModel!: string;

  /** موسسه حسابداری شرکت */
  companyInspectionInstitute!: string;

  /** شرکت */
  company!: string;

  /** شناسه عطف */
  parentAdvertId!: number | null;

  /** شناسه نوع */
  docTypeCodeGroupId!: number;

  /** شناسه گروه */
  docTypeCodeTypeId!: number;

  /** شناسه موسسه حسابداری شرکت */
  companyInspectionInstituteId!: number;

  /** شناسه شرکت */
  companyId!: number;

  /** دلیل عدم تائید */
  rejectedReason!: string | null;

  /** عنوان اسناد */
  subject!: string;

  /** نظر ناظر */
  comment!: string | null;

  /** نام ناظر */
  supervisiorName!: string | null;

  publisherStatus?: PublisherStatus;

  docTypeCodeGroupModel?: DocumentGroup;

  companyType?: CompanyType;

  documentType?: DocumentType | string;

  companyInspectionInstituteModel?: CompanyInspectionInstitute;

  isNotAudited?: false;

  isAudited?: false;

  isRootAdvert?: false;

  isLeafAdvert?: false;

  isRootCompany?: false;

  isLeafCompany?: false;

  isHolding?: false;

  fromPublishDate?: any;

  toPublishDate?: any;

  financialManager?: number;

  companyTypeId?: number;

  companyModel?: Company;

  multiMediaIds?: number[];

  companyName?: string;

  onlineDocDefinitionId!: number;

  docId?: number;

  stateOrder?: number;

  publisherCompanyName?: string;

  docTypeCodeSubject?: string;

  myCheckedDatePersian!: Date;

  myAddedDatePersian!: Date;

  docStatusTitle!: string;

  docTypeCodeDescription!: string;

  stateCompanyName!: string;

  tags!: any;

  yearValue!: number;

  withSubsets!: boolean;

  docTypeId!: number;

  dateTag!: string;

  sendDateFrom!: string | null;
  sendDateTo!: string | null;
  status!: number;
  myCheckedStatus!: number;
  myCheckedStatusTitle!: string;
  docTypeCodeTypeName!: string;
  docTypeCode!: number;
  documentTypeGroup!: string;
}

/** کاربرها */
export class Person {
  /** آدرس سرویس */
  static readonly apiAddress: string = 'api/SsoApi/Account/user/GetAllUser';

  /** شناسه */
  id!: number;

  /** نام */
  firstName!: string;

  /** نام خانوادگی */
  lastName!: string;

  fullName!: string;

  /** نام پدر */
  fatherName!: string;

  /** جنسیت */
  genderType!: boolean;

  /** کد ملی */
  nationalId!: string;

  /** تاریخ تولد */
  birthDate!: Date;

  /** شماره شناسنامه */
  birthCertificateNumber!: string;

  /** نام کاربری */
  userName!: string;

  /** نام کاربری */
  password!: string;

  /** نام کاربری */
  rePassword!: string;

  /** شناسه شرکت */
  companyId?: number;

  /** نقش */
  role?: number;

  personelNumber?: string;

  post?: string;

  userId!: number;

  name!: string;

  nationalID!: string;

  groupId!: number;
}

export class ChangePassword {
  static readonly apiAddress = 'api/PABudgetApi/v1/Password/Reset';
  static readonly apiAddressSet = 'api/PABudgetApi/v1/Password/Set';
}

/** کاربرها */
export class DeletePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/Account/user/remove/';
}

export class FileType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/FileMimeType';
  id!: number;
  type!: string;
  description!: string;
  extention!: string;
  attachmentFileTypeTemplateId!: number;
  fileMimeTypeName!: string;
  enName!: string;
}

export class listReportForTree {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/listReportForTree';
  id!: number;
  reportName!: string;
}

/** ناظرین */
export class AssignCompanyToSupervisor {
  /** آدرس سرویس */
  static readonly apiAddress =
    'api/PABudgetApi/v1/Info/AssignCompanyToSupervisor';
}

/** ناظرین */
export class CompanyTree {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/Company/tree';

  id!: number;
  data!: string;
  hasPermission!: boolean;
  icon!: string;
  label!: string;
  children?: CompanyTree[];
}

/** ناظرین */
export class Supervisor {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/info/GetSupervisors';

  userId!: number;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  nationalId!: string;
  fatherName!: string;
  genderType!: number;
  birthDate!: Date;
  birthCertificateNumber!: string;
}

/** نقش کاربران */
export class PersonRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/SsoAdmin/User/GetAllUsersWithRoles';
  static readonly apiAddressRemove = 'api/SsoApi/SsoAdmin/userRole/remove';

  roleId!: number;
  userId!: number;
  firstName!: string;
  lastName!: string;
  nationalID!: string;
  roleName!: string;
}

/** کاربران */
export class GeneralPerson extends Person {
  /** آدرس سرویس */
  static override readonly apiAddress: string =
    'api/SsoApi/SsoAdmin/GetUsersWithRole';
  email!: string;
}

/** نوع‌های شرکت */
export class Company {
  /** آدرس سرویس */

  static readonly apiAddress = 'api/PABudgetApi/v1/company/All';
  static readonly apiAddressSubset = 'api/PABudgetApi/v1/company/subsets';
  static readonly apiAddressSubCompanies =
    'api/PABudgetApi/v1/Company/SubCompanies/';
  static readonly apiAddressDetailCo = 'api/PABudgetApi/v1/Company/';
  static readonly apiAddressUserCompany =
    'api/PABudgetApi/v1/Company/UserCompany/';

  static readonly apiAddressReportParentCo =
    'api/PABudgetApi/Dashboard/ReportParentCompany';

  id!: number;
  parentId!: number;
  parent?: Company;
  symbol!: string;
  companyName!: string;
  name!: string;
  companyType!: string;
  latinName!: string;
  nationalID!: string;
  isic?: string;
  companyISIN?: string;
  registerNumber?: string;
  activitySubject?: string;
  factoryAddress?: string;
  factoryTelephone?: string;
  factoryFax?: string;
  stockAffairsOffice?: string;
  stockAffairsTelephone?: string;
  stockAffairsFax?: string;
  centeralOffice?: string;
  centeralOfficeTelephone?: string;
  centeralOfficeFax?: string;
  managingDirector?: string;
  financialManager?: string;
  registerDate!: any;
  registerDatePC!: any;
  periodTypeId!: any;
  registeredCapital?: number;
  nonRegisteredCapital?: number;
  companyTypeId?: number;
  companyTypeModel?: CompanyType;
  activityTypeId?: number;
  activityType?: ActivityType;
  reportingTypeId?: any;
  reportingType?: ReportingType;
  companyInspectionInstituteId?: number;
  companyInspectionInstitute?: CompanyInspectionInstitute;
  substituteInspector?: string;
  hasAccessAll?: boolean;
  isMyCompany?: boolean;
  logo?: string;
  persianRegisterDate?: string;
  isSelected?: boolean;
  companyId?: number;
  count?: number;
  countOfEmployees?: number;
  systemOrganizationCode?: number;
  percentOwner?: number;
  fromDate?: any;
  toDate?: any;
  auditStart?: any;
  auditEnd?: any;
  meetingNo?: any;
  meetingDate?: any;
  ceo!: string;
  oldCode!: string;
  shareHolders: any;
  partyLogo!: string;
  multiMediaId!: number;
  managerName!: string;
  companyTypeTitle!: string;
  reportingTypeTitle!: string;
  activityTypeTitle!: string;
  countOfEmployee!: number;
  companyParentName!: string;
  RegisterNumber!: number;
  companyInspectionInstituteTitle!: string;
  companyManagerName!: string;
  registerDatePc!: any;
}

export class ProductGroup {
  static readonly getListApiAddress =
    'api/PABudgetApi/ProductGroup/GetAllProductGroups';
  static readonly getTreeViewApiAddress =
    'api/PABudgetApi/ProductGroup/GetProductGroupTreeView';
  static readonly createApiAddress =
    'api/PABudgetApi/ProductGroup/CreateProductGroup';
  static readonly editApiAddress =
    'api/PABudgetApi/ProductGroup/UpdateProductGroup';
  static readonly deleteApiAddress =
    'api/PABudgetApi/ProductGroup/DeleteProductGroup';

  id!: number;
  parentId!: number | null;
  productGroupCode!: number;
  productGroupTitle!: string;
  children!: ProductGroup[];
}

/**قرارداد */
export class Contract {
  /** آدرس سرویس */

  static readonly apiAddress = 'api/PABudgetApi/v1/Info/GetContractById/';
  static readonly apiAddressDel = 'api/PABudgetApi/v1/Info/DeleteContract';

  id!: number;
  contractCode!: number;
  contractDate!: any;
  contractFromDate!: any;
  contractToDate!: any;
  contracTypeID!: any;
  employerID!: number;
  contractorID!: number;
  contractPriceCu!: number;
  milContractDate!: any;
  milContractFromDate!: any;
  milContractToDate!: any;
}
/** کاربرها */
export class AssignRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/SsoAdmin/AssignRoleToUser';
}
/** موسسه‌های حسابرسی شرکت */
export class CompanyInspectionInstitute {
  /** آدرس سرویس */
  static readonly apiAddress =
    'api/PABudgetApi/v1/BaseInfo/CompanyInspectionInstitute';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** وضعیت‌های ناشر */
export class PublisherStatus {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/PublisherStatus';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** فعالیت‌ها */
export class ActivityType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/ActivityType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** شرکت‌ها */
export class CompanyType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/CompanyType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

export class ContractType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/ContracType';
  id!: number;
  title!: string;
  code!: string;
  isActive!: boolean;
}

export class Employers {
  static readonly apiAddress =
    'api/PABudgetApi/v1/BaseInfo/Party/GetAllEmployers';
  partyNationalID!: any;
  partyName!: string;
}
/** ماهیت‌ها */
export class ReportingType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/ReportingType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** کاربرها */
export class CreatePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/Account/user/create';
}
/** کاربرها */
export class UpdatePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/info/person/update';
}
export class DocumentType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/DocumentType';
  id!: number;
  title!: string;
  code!: string;
  order!: number;
  parentId!: any;
  childes!: number;
  key!: any;
  label!: string;
  selectable!: boolean;
  documentTypeGroupId!: number;
  periodTypeId!: number;
}

export class DocumentTypeFileNeeds {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/DocTypeFileNeeds';
  id!: number;
  title!: string;
  extention!: string;
  isAdded!: boolean;
  docTyeFileNeedsId!: number;
  isRequired!: boolean;
  year!: number;
  month!: number;
  attachmentFileTypeName!: string;
}

export class TagType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/TagType';
  static readonly apiAddress1 = 'api/PABudgetApi/v1/BaseInfo/DocTypeTags';
  static readonly apiAddressTags = 'api/PABudgetApi/v1/Tags';
  static readonly apiAddressTags2 = 'api/PABudgetApi/v1/FinancialExpert';
  tagTypeId!: number;
  id!: number;
  name!: string;
  typeName!: string;
  docType!: string;
  displayName!: string;
  docTypeTagsId!: number;
  docTypeId!: any;
  documentTypeId!: any;
  tagName!: string;
  isRequired!: boolean;
  tagValue!: string;
  tagServiceMasterId!: number;
  tagServiceMasterData!: any;
}
/** عناوین */
export class Subject {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/master';

  /** شناسه */
  id!: number;

  /** شرح */
  title!: string;

  /** نام لاتین */
  enName!: string;
}

export class DocumentTypeGroup {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/DocTypeGroup';

  title!: string;
  withOutPagination!: boolean;
  id!: number;
}
export class DocumentGroup {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/BaseInfo/DocumentGroup';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
export class PeriodType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/PeriodType';

  id!: number;
  name!: string;
  valueType!: number;
}
export class PeriodBudgetType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/PeriodBudgetType/';
}

export class AttachmentType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/AttachmentFileType';
  id!: number;
  title!: string;
  enName!: string;
  tempPath!: string;
  fileMimeTypeId!: number;
  attachmentFileTypeTemplateId!: number | null;
}

export class CreateOnlineDocDefinition {
  static readonly apiAddress =
    'api/PABudgetApi/v1/BaseInfo/OnlineDocDefinition';
  id!: number;
  description!: string;
  activeDate!: string | null;
  expiredDate!: string | null;
  increaseValueScore!: number;
  decreaseValueScore!: number;
  isActive!: boolean;
  documentTypeId!: number;
  onlineDocumentNeedsInfos!: DocumentTypeFileNeeds;
  activeDatePersian!: Date;
  expiredDatePersian!: Date;
  docTypeName!: string;
}
/** اطلاعات پایه */
export class CreateBasics {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/slave/create';
}
/** اطلاعات پایه */
export class Basics {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/master';

  /** شناسه */
  id!: number;

  /** شرح */
  title!: string;

  /** کد */
  code!: string;

  /** شناسه نوع */
  masterId!: number;
}

/** نوع‌های شرکت */
export class DeleteCompany {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/company';
}

/**اعضاء شرکت */
export class personsCompany {
  static readonly apiAddress =
    'api/PABudgetApi/v1/CompanyManager/GetAllPersonsCompanyByRole';
}

/**اعضاء شرکت */

/** نوع‌های شرکت */
export class ListCompany {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/company/list';
}
/** نوع‌های شرکت */
export class CreateCompany {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/company/create';
}
// export class CreateOnlineDocDefinition {
//   static readonly apiAddress = 'api/v1/Advertisement/OnlineAdvertDefinition';
//   id!: number;
//   description!: string;
//   activeDate!: string | null;
//   expiredDate!: string | null;
//   increaseValueScore!: number;
//   decreaseValueScore!: number;
//   isActive!: boolean;
//   docTypeCodeTypeId!: number;
//   onlineAdvertNeedsInfos!: DocumentTypeFileNeeds;
//   activeDatePersian!: Date;
//   expiredDatePersian!: Date;
//   docTypeCodeTypeName!: string;
// }
/** ناظرین */
export class Publisher extends Report {
  /** آدرس سرویس */
  static override readonly apiAddress = 'api/PABudgetApi/v1/FinancialExpert';
  static override readonly apiAddressSearch =
    'api/PABudgetApi/v1/FinancialExpert/search';
}
export class AssetAttachment {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/FileManagerApi/v1/FileManager/UploadFile';
  static readonly downloadApiAddress =
    'api/FileManagerApi/v1/FileManager/DownloadFile';

  multiMediaId!: number;
  fileSize!: number;
  fileName!: string;
}
export class DocumentStatus {
  static readonly apiAddress = 'api/v1/BaseInfo/DocumentStatus/list';
  title!: string;
  id!: number;
}

export class OnlineDocumentAttachmentNeeds {
  static readonly apiAddress =
    'api/PABudgetApi/v1/BaseInfo/OnlineDocAttachmentNeeds';
  onlineAdvertAttachmentNeedsId!: number;
  attachmentFileTypeTitle!: string;
  description!: string;
  extention!: string;
  type!: string;
  isRequired!: boolean;
  title!: string;
  advertAttachmentNeedsYear!: number;
  advertAttachmentNeedsMonth!: number;
}

export class ReportAttachment {
  /** شناسه */
  docId!: number;

  /** پیوست‌ها */
  attachments!: Attachments[];
}

export class Attachments {
  size!: string;
  id!: number;
  type!: AttachmentsType;
  fileName!: string;
  mimeType!: string;
  fileLocation!: string;
}

export enum AttachmentsType {
  NONE = 0,
  IMAGE,
  VIDEO,
  PDF,
  WORD,
  EXCEL,
}
/** فایل‌ها */
export class Asset {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Assets/attachment';
}

export class AdvertStatusHistory {
  static readonly apiAddress = 'api/v1/Report/AdvertStatusHistory';

  docStatus!: string;
  stateOrder!: number;
  lastName!: string;
  comment!: string;
  advertStatusColor!: string;
  advertModifiedDate!: string;
  fullname!: string;
  companyName!: string;
  advertModifiedTime!: string;
  myCheckedStatusTitle!: string;
  myCheckedStatus!: number;
}

/** ناظرین */
export class SupervisorSearch extends Report {
  /** آدرس سرویس */
  static override readonly apiAddress = 'api/v1/supervisor';
  static readonly apiAddressList = 'api/v1/supervisor/list';
}

export class CEO {
  static readonly apiAddress = 'api/v1/CEO';
  static readonly apiAddressLand = 'api/v1/';

  title!: string;
  icon!: string;
  url!: string;
  subsets!: Array<CEO>;
  id!: number;
  headLine!: Array<CEO>;
  count!: number;
  order!: number;
}
export class AllDocs {
  static readonly apiAddress = 'api/v1/Advertisement/allAdvert';
}

export class years {
  static readonly apiAddress = 'api/v1/BaseInfo/FinancialYear';

  title!: string;
  id!: number;
  startDate!: any;
  endDate!: any;
  pEndDate!: string;
  pStartDate!: string;
  financialYearDataTypeId!: number;
  financialYearDataValue!: number;
  parentId!: number;
}

export class Dashboard {
  /** آدرس سرویس */
  static readonly apiAddressReportChart =
    'api/PABudgetApi/Dashboard/reportchart';
  static readonly apiAddressReportType =
    'api/PABudgetApi/v1/BaseInfo/ReportType/list';
  static readonly apiAddressCashBudgetByMonthForProfile =
    'api/PABudgetApi/Dashboard/CashBudgetByMonthForProfile/';
  static readonly apiAddressShareholdersDashboard =
    'api/PABudgetApi/Dashboard/ShareholdersDashboard/';
  static readonly apiAddressCostAndBenefitForProfile =
    'api/PABudgetApi/Dashboard/CostAndBenefitForProfile/';
  labels!: Array<string>;
  datasets!: Array<number>;
  id!: number;
  title!: string;
  isSelected?: boolean;
}

export class BaseInfo {
  /** آدرس سرویس */
  static readonly apiAddressYearTypet =
    'api/PABudgetApi/v1/BaseInfo/FinancialYearType/list';
  id!: number;
  title!: string;
  isSelected?: boolean;
}

export class Period {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/Period/';
  static readonly apiAddressDetail =
    'api/PABudgetApi/v1/BaseInfo/PeriodDetail/';
  static readonly apiAddressUnits =
    'api/PABudgetApi/v1/BudgetPeriod/GetAllUnits/';
  id!: number;
  title!: string;
  periodTitle!: string;
  code!: string;
  periodCode!: string;
  statusTitle!: string;
  fromDate!: any;
  toDate!: any;
  type1!: string;
  type2!: string;
  periodId!: number;
  list!: Period[];
}

export class StaticYear {
  /** آدرس سرویس */
  static readonly apiAddress =
    'api/PABudgetApi/v1/BaseInfo/Period/LastFiveYear';
  id!: number;
  periodTitle!: string;
  periodCode!: string;
  isSelected!: boolean;
}

export class GridBalanceSheet {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/Dashboard/GridBalanceSheet/';

  reportTypeId!: number;
  reportName!: string;
  value!: number;
}

export class PersonelNo {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/PersonelNo/';

  id!: number;
  educationTypeId!: number;
  personelCount!: number;
  periodDetailId!: number;
  employeewageCU!: number;
  periodId!: number;
  statusTypeId!: number;
  educationTitle!: string;
  statusTitle!: string;
  type!: string;
  employmentTypeId!: number;
  perioddetailId!: number;
  costCenterTypeId!: number;
  periodTitle!: string;
}
export class ContractNo {
  static readonly apiAddress = 'api/PABudgetApi/v1/Info/CreateContract';
  static readonly adiAddressList = 'api/PABudgetApi/v1/Info/GetContractList';
  id!: number;
  contractCode!: string;
  contractDate!: any;
  contractFromDate!: any;
  contractToDate!: any;
  contracTypeID!: number;
  employerID!: number;
  contractorID!: number;
  contractPriceCu!: number;
  contractNo!: number;
  type!: string;
  contracType!: string;
  milContractToDate!: any;
  milContractDate!: any;
  milContractFromDate!: any;
  companyId!: any;
}

export class BudgetSourceUse {
  static readonly apiAddress =
    'api/PABudgetApi/v1/BudgetResourceUse/CreateOrUpdate';
  static readonly apiAddressList = 'api/PABudgetApi/v1/BudgetResourceUse/List';
  static readonly apiAddressDel = 'api/PABudgetApi/v1/BudgetResourceUse/Delete';
  static readonly apiAdressResourceUse =
    'api/PABudgetApi/v1/BaseInfo/ResourceUseType/list';
  static readonly apiAddressDetail =
    'api/PABudgetApi/v1/BudgetResourceUse/getById/';
  static readonly apiAddressGroupList =
    'api/PABudgetApi/v1/BudgetResourceUse/SourceUseTypesForCreate/List';
  static readonly apiAddressGroupAddOrUpdate =
    'api/PABudgetApi/v1/BudgetResourceUse/InsertOrUpdateBudgetResourceUsesBySourceUseTypes/Create';
  id!: number;
  type!: string;
  budgetPeriodId!: number;
  period!: null;
  budgetPeriodDetailId!: number;
  periodDetail!: any;
  companyId!: number;
  company!: any;
  sourceUseTypeId!: number;
  budgetResourceUse_Slave_SourceUseTypeId!: number;
  budgetPriceCu!: any;
  realPriceCu!: any;
  stauseCode!: number;
  addedDate!: any;
  modifiedDate!: any;
  ipAddress!: any;
  sourceUseTypeTitle!: string;
  SourceUseTypeTitle!: string;
  periodId!: string;
  title!: string;
  priceRealCu!: string;
  budgetPricelCu!: string;
  code!: any;
}

export class CostCenterType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/CostCenterType/';

  id!: number;
  title!: string;
  isActive!: boolean;
}

export class EmploymentType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/EmploymentType/';

  id!: number;
  title!: string;
  isActive!: boolean;
}

export class EducationTypeCode {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/EducationTypeCode/';

  id!: number;
  title!: string;
  isActive!: boolean;
}

export class ReportItemType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/ReportItemType/';
}

export class Sale {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/Sale/';
  static readonly typesApiAddress = 'api/PABudgetApi/v1/Sale/';

  id!: number;
  // title!: string
  budgetPeriodId!: number;
  budgetPeriodTitle!: string;
  budgetPeriodDetailId!: number;
  budgetPeriodDetailTitle!: string;
  contractId!: number;
  saleType!: number;
  productGroupId!: number;
  productGroupTitle!: string;
  productNumber!: number;
  productUnitSalesCu!: number;
  productAllSalesCu!: number;
  costingUnitCu!: number;
  costingAllCu!: number;
  benefitLossCu!: number;
  companyId!: number;
}

export class Profile {
  /** آدرس سرویس */
  static readonly apiAddressGetPlan = 'api/PABudgetApi/Dashboard/GetPlan/List';
  static readonly apiAddressGetBudget =
    'api/PABudgetApi/Dashboard/GetBudget/List';
  static readonly apiAddressGetPlanDetail =
    'api/PABudgetApi/Dashboard/GetPlanDetail/List';
  static readonly apiAddressGetBudgetDetail =
    'api/PABudgetApi/Dashboard/GetBudgetDetail/List';
  static readonly apiAddressGetChart = 'api/PABudgetApi/Dashboard/GetChart';
  static readonly apiAddressGetPriceType =
    'api/PABudgetApi/Dashboard/GetPriceType';

  id!: number;
  title!: string;
  icon!: string;
  companyId!: number;
  firstPeriodId!: number;
  secondPeriodId!: number;
  accountReportCode!: string;
}

export class Plan {
  /** آدرس سرویس */
  static readonly apiAddressVisionAndMission =
    'api/PABudgetApi/Dashboard/VisionAndMission/Info';
  static readonly apiAddressValue = 'api/PABudgetApi/Dashboard/Value/Info';
  static readonly apiAddressYearUnion =
    'api/PABudgetApi/Dashboard/YearUnion/Info';
  static readonly apiAddressOrientation =
    'api/PABudgetApi/Dashboard/Orientation/Info';
  static readonly apiAddressGoals = 'api/PABudgetApi/Dashboard/Goals/Info';
  static readonly apiAddressStrategyMap =
    'api/PABudgetApi/Dashboard/StrategyMap/Info';
  static readonly apiAddressStrategyPlan =
    'api/PABudgetApi/Dashboard/Strategy/List';
  static readonly apiAddressOperationalPlans =
    'api/PABudgetApi/Dashboard/OperationalPlans/Info';
  static readonly apiAddressSWOT = 'api/PABudgetApi/Dashboard/SWOT/List';
  static readonly apiAddressInformations =
    'api/PABudgetApi/Dashboard/Informations/Info';
  static readonly apiAddressRisk = 'api/PABudgetApi/Dashboard/Risk/Info';
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/';
}

export class Planning {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/Planning/';
  id!: number;
  planingCode!: number;
  title!: string;
  planingDate!: string;
  companyId!: number;
  meetingId!: number;
  startDate!: string;
  endDate!: string;
}
export class PlanningValue {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/PlanningValue/';
  id!: number;
  planingCode!: number;
  title!: string;
  planingDate!: string;
  companyId!: number;
  meetingId!: number;
  startDate!: string;
  endDate!: string;
}
export class Vision {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/Vision/';
  id!: number;
  planningId!: number;
  title!: string;
  visionCode!: string;
  keyTypeCode!: number;
  planningValueId!: number;
}
export class Mission {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/Mission/';
  id!: number;
  planningId!: number;
  title!: string;
  missionCode!: string;
  typeCode!: number;
}
export class Project {
  static readonly apiAddress = 'api/PABudgetApi/v1/Project/Project/';
  static readonly apiAddressProjectTypeCode =
    'api/PABudgetApi/v1/BaseInfo/ProjectTypeCode/';
  static readonly apiAddressCreate =
    'api/PABudgetApi/v1/Project/Project/Create';
  static readonly apiAddressUpdate =
    'api/PABudgetApi/v1/Project/Project/Update';

  static readonly apiAddressSourceType =
    'api/PABudgetApi/v1/BaseInfo/ProjectSourceType/';
  id!: number;
  title!: string;
  budgetPeriodId!: number;
  fromBudgetPeriodId!: number;
  toBudgetPeriodId!: number;
  code!: string;
  companyId!: number;
  address!: string;
  typeCode!: number;
  internalRateOfReturn!: number;
  netPersentValue!: number;
  payBackPeriod!: number;
}
export class ProjectIncome {
  static readonly apiAddress = 'api/PABudgetApi/v1/Project/ProjectIncome/';
  id!: number;
  periodId!: number;
  periodDetailId!: string;
  projectId!: number;
  unitId!: number;
  sourceType!: number;
  priceCu!: number;
  realPriceCu!: number;
  title!: string;
  periodTitle!: string;
}
export class ProjectCost {
  static readonly apiAddress = 'api/PABudgetApi/v1/Project/ProjectCost/';
  id!: number;
  title!: string;
  periodTitle!: string;
  periodId!: number;
}
export class KeyTypecode {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/KeyType/';
  id!: number;
  title!: string;
}

export class AssemblyAssignments {
  static apiAddress = 'api/PABudgetApi/v1/BudgetPeriod/YearUnion/';
  static apiAddressMeetingTopic =
    'api/PABudgetApi/v1/BaseInfo/YearUnionMeetingTopic/';
  static apiAddressTypeCode =
    'api/PABudgetApi/v1/BaseInfo/UnionDetail/TypeCode/';
  static apiAddressDetails = 'api/PABudgetApi/v1/BudgetPeriod/YearUnionDetail/';

  id!: number;
  budgetPeriodId!: number;
  meetingId!: number;
  typeCode!: number;
  companyId!: number;
  title!: string;
  meetingDate!: string;
  type!: string;
}
export class Budget {
  static readonly apiAddressBalanceSheet =
    'api/PABudgetApi/Dashboard/BalanceSheet/Info';
  static readonly apiAddressCostAndBenefit =
    'api/PABudgetApi/Dashboard/CostAndBenefit';
  static readonly apiAddresBudgetResourceUse =
    'api/PABudgetApi/Dashboard/BudgetResourceUse';
  static readonly apiAddresOwnershipValue =
    'api/PABudgetApi/Dashboard/OwnershipValue';

  static readonly apiAddressCompareBudgetWithReal =
    'api/PABudgetApi/Dashboard/CompareBudgetWithReal/';
  static readonly apiAddressCompareBudgetWithBudget =
    'api/PABudgetApi/Dashboard/CompareBudgetWithBudget/';
  static readonly apiAddressCompareRealWithBudget =
    'api/PABudgetApi/Dashboard/CompareRealWithBudget/';
}

export class StatementCashFlows {
  static readonly apiAddressStatementCashFlows =
    'api/PABudgetApi/Dashboard/StatementCashFlows';
}
export class ReconciliationStatementOperating {
  static readonly apiAddressReconciliationStatementOperating =
    'api/PABudgetApi/Dashboard/ReconciliationStatementOperating';
}
export class ReceiveAndPay {
  static readonly apiAddressReceiveAndPay =
    'api/PABudgetApi/Dashboard/ReceiveAndPay';
}
export class Reports {
  static readonly apiAddressBoardmembers =
    'api/PABudgetApi/v1/CSPF/GetBoardmembers';
  static readonly apiAddressCompanyManagerActivity =
    'api/PABudgetApi/v1/CSPF/GetCompanyManagerActivity';
  static readonly apiAddressAllSubCompanyCountWithCompanyType =
    'api/PABudgetApi/v1/CSPF/GetAllSubCompanyCountWithCompanyType';
  static readonly apiAddressplan = 'api/PABudgetApi/v1/CSPF/Getplan';
  static readonly apiAddressRanking = 'api/PABudgetApi/v1/CSPF/GetRanking';
  static readonly apiAddressElection = 'api/PABudgetApi/v1/CSPF/GetElection';
  static readonly apiAddressAssemblies =
    'api/PABudgetApi/v1/CSPF/GetAssemblies';
  static readonly apiAddressRankingManagers =
    'api/PABudgetApi/v1/CSPF/GetRankingManagers';
  static readonly apiAddresslegalCases =
    'api/PABudgetApi/v1/CSPF/GetLegalCases';
}

export class AccountReportItemPrice {
  static readonly apiAddress = 'api/PABudgetApi/v1/AccountReportItemPrice/';
  id!: number;
  priceCu!: number;
  reportItemCode!: string;
  reportItemTitle!: string;
  companyId!: number;
  companyName!: string;
  periodId!: number;
  periodTitle!: string;
  fromPeriodDetailId!: number;
  fromPeriodDetailTitle!: string;
  toPeriodDetailId!: number;
  accountRepId!: number;
  toPeriodDetailTitle!: string;
}

export class AccountReportToItem {
  static readonly apiAddress = 'api/PABudgetApi/v1/AccountReportToItem/';
  id!: number;
  accountReptId!: number;
  accountRepTitle!: string;
  companyId!: number;
  companyTitle!: string;
  accountRepItemId!: number;
  accountRepItemTitle!: string;
}
export class AccountReportItem {
  static readonly apiAddress = 'api/PABudgetApi/v1/AccountReportItem/';
  id!: number;
  parentId!: number | null;
  itemReportTypeCode!: number;
  itemReportTypeTitle!: string;
  children!: ProductGroup[];
}

export class FinancialStatementsReport {
  static readonly apiAddress =
    'api/PABudgetApi/Report/GetFinancialStatementsReport/';
  periodCode!: number;
  priceCu!: number;
  title!: string;
}

export class BenefitCostsReport {
  static readonly apiAddress =
    'api/PABudgetApi/Report/GetBenefitCostReport/';
  periodCode!: number;
  priceCu!: number;
  title!: string;
}

export class AccountReport {
  static readonly apiAddress = 'api/PABudgetApi/v1/AccountReport/';
  static readonly apiAddressList =
    'api/PABudgetApi/v1/AccountReport/GetAllAccountReport';
  static readonly apiAddressTree = 'api/PABudgetApi/v1/AccountReportItem/Tree';
  static readonly apiAddressItemCreate =
    'api/PABudgetApi/v1/AccountReportToItem/create';
  static readonly apiAddressDragDrop =
    'api/PABudgetApi/v1/AccountReportToItem/GetAccountRepToItemListByOrder';
  static readonly apiAddressDragDropUpdate =
    'api/PABudgetApi/v1/AccountReportToItem/UpdateOrder';

  id!: number;
  code!: string;
  title!: string;
  reportTypeCode!: number;
  periodTypeCode!: number;
  accountRepId!: number;
  accountRepItemId!: number;
  companyId!: number;
  accountReportId!: number;
  isUsedInAccountReportToItem!: boolean;
  accountRepItemTitle!: string;
  accountRepTitle!: string;
  upId!: number;
  subId!: number;
}

export class PermissionProfile {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/PermissionProfile/';
}

export class CompanyManager {
  static readonly apiAddress = 'api/PABudgetApi/v1/CompanyManager/';
  id!: number;
  companyId!: number;
  companyTitle!: string;
  personId!: number;
  registerDate!: string;
  dismissalDate!: string;
  meetingManagmentNumber!: string;
  meetingManagementDate!: string;
  managerTypeId!: number;
  managerTypeTitle!: string;
  name!: string;
  lastName!: string;
}

export class ManagerType {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/ManagerType/';
}

export class Persons {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/GetPerson';
}

export class Aspect {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/AspectCode/';
}

export class BigGoal {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/BigGoal/';
  id!: number;
  visionId!: number;
  title!: string;
  bigGoalCode!: string;
  aspectCode!: number;
}

export class SWTO {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/SWTO/';
  id!: number;
  title!: string;
}

export class STRATEGY {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/Strategy/';
  id!: number;
  title!: string;
}
export class YearGoal {
  static readonly apiAddress = 'api/PABudgetApi/v1/BudgetPeriod/YearGoal/';
  id!: number;
  title!: string;
}

export class TypeCodeAssumptions {
  static readonly apiAddress =
    'api/PABudgetApi/v1/BaseInfo/TypeCodeAssumptions/';
  id!: number;
  title!: string;
}
export class TypeCode {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/YearPolicyKeyWord/';
  id!: number;
  title!: string;
}
export class Assumptions {
  static readonly apiAddress = 'api/PABudgetApi/v1/BudgetPeriod/Assumptions/';
  id!: number;
  title!: string;
}
export class YearActivity {
  static readonly apiAddress = 'api/PABudgetApi/v1/BudgetPeriod/YearActivity/';
  static readonly apiAddressWeight =
    'api/PABudgetApi/v1/BaseInfo/YearActivity/Weight/';
  static readonly apiAddressPriority =
    'api/PABudgetApi/v1/BaseInfo/YearActivity/Priority/';
  static readonly apiAddressCostCenter =
    'api/PABudgetApi/v1/BaseInfo/YearActivity/CostCenter/';
  static readonly apiAddressExceptedYearActivities =
    'api/PABudgetApi/v1/BudgetPeriod/GetExceptedYearActivities/';
  id!: number;
  title!: string;
}

export class Operating {
  static readonly apiAddress = 'api/PABudgetApi/v1/BudgetPeriod/Operating/';
  id!: number;
  title!: string;
}

export class RelationType {
  static readonly apiAddress =
    'api/PABudgetApi/v1/BaseInfo/RelatedActivity/RelationType/';
  id!: number;
  title!: string;
}

export class YearPolicy {
  static readonly apiAddress = 'api/PABudgetApi/v1/BudgetPeriod/YearPolicy/';
  id!: number;
  title!: string;
}

export class YearRisk {
  static readonly apiAddress = 'api/PABudgetApi/v1/BudgetPeriod/YearRisk/';
  id!: number;
  title!: string;
}

export class EvaluateIndex {
  static readonly apiAddress = 'api/PABudgetApi/v1/Plan/EvaluateIndex/';
  id!: number;
  title!: string;
}
export class KeyTypeCode {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/Risk/keyTypeCode/';
  id!: number;
  title!: string;
}
export class FinancialRatio {
  static readonly apiAddressTypeCode = 'api/PABudgetApi/v1/BaseInfo/GetFinancialRatioTypeCode/';
  static readonly apiAddress = 'api/PABudgetApi/v1/FinancialRatio/FinancialRatio/';
  id!: number;
  title!: string;
}