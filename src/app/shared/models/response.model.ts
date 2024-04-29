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
  static override readonly apiAddress: string = 'api/SsoApi/SsoAdmin/permissions';
}

export class AllRoleDocumentTypeTree extends RolePermissions {
  static readonly apiAddress1 = 'api/PABudgetApi/v1/role/AllRoleDocumentTypeTree';
}

/** نقش‌ها */
export class Role {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/SsoApi/SsoAdmin/Role/List';

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

  static readonly apiAddressUserGroups = 'api/PABudgetApi/v1/GroupPolicy/UserGroups';

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
  static readonly apiAddress: string = 'api/v1/Advertisement';
  static readonly apiAddressSearch: string = 'api/v1/Advertisement/search';

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
  advertStatus!: boolean | null | number;

  /** دلیل اسناد */
  amendmentReason!: boolean | null;

  /** دارای اصلاحیه */
  hasAmendment!: boolean;

  /** گروه */
  advertisementGroup!: string;

  /** نوع */
  advertisementTypeModel!: string;

  /** موسسه حسابداری شرکت */
  companyInspectionInstitute!: string;

  /** شرکت */
  company!: string;

  /** شناسه عطف */
  parentAdvertId!: number | null;

  /** شناسه نوع */
  advertisementGroupId!: number;

  /** شناسه گروه */
  advertisementTypeId!: number;

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

  advertisementGroupModel?: DocumentGroup;

  companyType?: CompanyType;

  advertisementType?: DocumentType | string;

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

  publisherStatusId?: number;

  companyTypeId?: number;

  companyModel?: Company;

  multiMediaIds?: number[];

  companyName?: string;

  onlineAdvertDefinitionId!: number;

  advertId?: number;

  stateOrder?: number;

  publisherCompanyName?: string;

  advertisementSubject?: string;

  myCheckedDatePersian!: Date;

  myAddedDatePersian!: Date;

  advertStatusTitle!: string;

  advertisementDescription!: string;

  stateCompanyName!: string;

  tags!: any;

  yearValue!: number;

  withSubsets!: boolean;

  advertTypeId!: number;

  dateTag!: string;

  sendDateFrom!: string | null;
  sendDateTo!: string | null;
  status!: number;
  myCheckedStatus!: number;
  myCheckedStatusTitle!: string;
  advertisementTypeName!: string;
  advertisementTypeCode!: number;
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


/** کاربرها */
export class CreateRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/role/create';
}

export class ChangePassword {
  static readonly apiAddress = 'api/PABudgetApi/v1/Password/Reset';
  static readonly apiAddressSet = 'api/PABudgetApi/v1/Password/Set';
}

/** کاربرها */
export class DeletePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/info/person/';
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

/** ناظرین */
export class AssignCompanyToSupervisor {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/Info/AssignCompanyToSupervisor';
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

  roleId!: number;
  userId!: number;
  firstName!: string;
  lastName!: string;
  nationalID!: string;
  roleTitle!: string;
}

/** کاربران */
export class GeneralPerson extends Person {
  /** آدرس سرویس */
  static override readonly apiAddress: string = 'api/SsoApi/SsoAdmin/GetUsersWithRole';
}

/** نوع‌های شرکت */
export class Company {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/company/All';
  static readonly apiAddressSubset = 'api/PABudgetApi/v1/company/subsets';

  id!: number;
  parentId!: number;
  parent?: Company;
  symbol!: string;
  companyName!: string;
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
  boardofDirectors?: string;
  alternateInspector?: string;
  registerDate!: any;
  yearEnd!: any;
  registeredCapital?: number;
  nonRegisteredCapital?: number;
  companyTypeId?: number;
  companyTypeModel?: CompanyType;
  activityTypeId?: number;
  activityType?: ActivityType;
  reportingTypeId?: any;
  reportingType?: ReportingType;
  publisherStatusId?: number;
  publisherStatus?: PublisherStatus;
  companyInspectionInstituteId?: number;
  companyInspectionInstitute?: CompanyInspectionInstitute;
  substituteInspector?: string;
  hasAccessAll?: boolean;
  isMyCompany?: boolean;
}


/** کاربرها */
export class AssignRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/Role/assign';
}
/** موسسه‌های حسابرسی شرکت */
export class CompanyInspectionInstitute {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/CompanyInspectionInstitute';

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
  static readonly apiAddress = 'api/PABudgetApi/v1/info/person/create';
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
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/DocTyeFileNeeds';
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
  tagTypeId!: number;
  id!: number;
  name!: string;
  typeName!: string;
  docType!: string;
  displayName!: string;
  docTypeTagsId!: number;
  documentTypeId!: any;
  tagName!: string;
  isRequired!: boolean;
  tagValue!: string;
  docTypeId!: number;
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

  localCode!: number;
}

export class DocumentTypeGroup {
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/DocumentTypeGroup';

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
  static readonly apiAddress = 'api/PABudgetApi/v1/BaseInfo/OnlineDocDefinition';
  id!: number;
  description!: string;
  activeDate!: string | null;
  expiredDate!: string | null;
  increaseValueScore!: number;
  decreaseValueScore!: number;
  isActive!: boolean;
  docTypeId!: number;
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
export class CreateOnlineAdvertDefinition {
  static readonly apiAddress = 'api/v1/Advertisement/OnlineAdvertDefinition';
  id!: number;
  description!: string;
  activeDate!: string | null;
  expiredDate!: string | null;
  increaseValueScore!: number;
  decreaseValueScore!: number;
  isActive!: boolean;
  advertisementTypeId!: number;
  onlineAdvertNeedsInfos!: DocumentTypeFileNeeds;
  activeDatePersian!: Date;
  expiredDatePersian!: Date;
  advertisementTypeName!: string;
}
/** ناظرین */
export class Publisher extends Report {
  /** آدرس سرویس */
  static override readonly apiAddress = 'api/v1/publisher';
  static override readonly apiAddressSearch = 'api/v1/publisher/search';
}
export class AssetAttachment {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Assets/attachment/upload';

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
    'api/v1/Advertisement/OnlineDocumentAttachmentNeeds';
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
  advertId!: number;

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

  advertStatus!: string;
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