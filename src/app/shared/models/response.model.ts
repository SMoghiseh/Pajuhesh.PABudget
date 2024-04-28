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
  static readonly apiAddress1 = 'api/v1/role/AllRoleDocumentTypeTree';
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
  static readonly apiAddress = 'api/v1/GroupPolicy/Group';

  static readonly apiAddressUserGroups = 'api/v1/GroupPolicy/UserGroups';

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
  static readonly apiAddress = 'api/v1/role/create';
}

export class ChangePassword {
  static readonly apiAddress = 'api/v1/Password/Reset';
  static readonly apiAddressSet = 'api/v1/Password/Set';
}

/** کاربرها */
export class DeletePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/person/';
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
  static readonly apiAddress = 'api/v1/Info/AssignCompanyToSupervisor';
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
  static readonly apiAddress = 'api/v1/info/GetSupervisors';

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
  static override readonly apiAddress: string = 'api/v1/info/GetGeneralPersons';
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
  static readonly apiAddress = 'api/v1/Role/assign';
}
/** موسسه‌های حسابرسی شرکت */
export class CompanyInspectionInstitute {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/CompanyInspectionInstitute';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** وضعیت‌های ناشر */
export class PublisherStatus {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/PublisherStatus';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** فعالیت‌ها */
export class ActivityType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/ActivityType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** شرکت‌ها */
export class CompanyType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/CompanyType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** ماهیت‌ها */
export class ReportingType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/ReportingType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}

/** کاربرها */
export class CreatePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/person/create';
}
/** کاربرها */
export class UpdatePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/person/update';
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
  static readonly apiAddress = 'api/v1/baseinfo/DocTyeFileNeeds';
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
  static readonly apiAddress1 = 'api/v1/baseinfo/DocTypeTags';
  static readonly apiAddressTags = 'api/v1/Tags';
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
  static readonly apiAddress = 'api/v1/BaseInfo/DocumentTypeGroup';

  title!: string;
  withOutPagination!: boolean;
  id!: number;
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
  static readonly apiAddress = 'api/v1/BaseInfo/slave/create';
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