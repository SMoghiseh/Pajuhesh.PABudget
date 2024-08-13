import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder, Company, Planning
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';

@Component({
  selector: 'PABudget-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  providers: [ConfirmationService]

})
export class PlanningComponent {

  public datePipe = new DatePipe('en-US');

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Planning[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new Planning();
  pId!: string;
  mode!: string;
  subComponentList = [
    { label: 'ارزش ها', icon: 'pi pi-fw pi-star', routerLink: ['/Operation/PlanningValue'] },
    { label: 'چشم انداز ', icon: 'pi pi-fw pi-eye', routerLink: ['/Operation/Vision'], },
    { label: 'ماموریت ', icon: 'pi pi-fw pi-briefcase', routerLink: ['/Operation/Mission'] },
    { label: 'SWOT', icon: 'pi pi-fw pi-star', routerLink: ['/Operation/SWOT'] },
    { label: 'استراتژی', icon: 'pi pi-fw pi-book', routerLink: ['/Operation/Strategy'] },
  ];
  // form property
  searchForm!: FormGroup;

  // dropdown data list
  meetingList: any = [];
  companyList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) { }

  ngOnInit(): void {
    this.getMeetingLst();
    this.getCompanyLst();

    this.searchForm = new FormGroup({
      planingCode: new FormControl(null),
      title: new FormControl(null),
      companyId: new FormControl(null),
      meetingId: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });
  }

  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', { 'withOutPagination': true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getMeetingLst() {
    // this.httpService
    //   .get<any[]>('')
    //   .subscribe(response => {
    //     if (response.data && response.data.result) {
    //       this.meetingList = response.data.result;
    //     }
    //   });
  }

  getPlan(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.searchForm.value;
    formValue.planingDate = formValue.planingDate
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          formValue.planingDate?.getFullYear(),
          formValue.planingDate?.getMonth(),
          formValue.planingDate?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;
    formValue.startDate = formValue.startDate
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          formValue.startDate?.getFullYear(),
          formValue.startDate?.getMonth(),
          formValue.startDate?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;
    formValue.endDate = formValue.endDate
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          formValue.endDate?.getFullYear(),
          formValue.endDate?.getMonth(),
          formValue.endDate?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;
    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      ...formValue,
    };

    this.first = 0;
    const url =
      Planning.apiAddress + 'List';
    this.httpService
      .post<Planning[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Planning()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addPlan() {
    this.modalTitle = 'افزودن برنامه راهبردی ';
    this.mode = 'insert';
    this.isOpenAddEditPlan = true;
  }

  editRow(data: Planning) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: Planning) {
    if (item && item.id)
      this.confirmationService.confirm({
        message: `آیا از حذف "${item.title} " اطمینان دارید؟`,
        header: `عنوان "${item.title}"`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePlan(item.id, item.title),
      });
  }

  deletePlan(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<Planning>(
          UrlBuilder.build(
            Planning.apiAddress + 'Delete',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'plan',
              life: 8000,
              severity: 'success',
              detail: ` برنامه  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getPlan();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditPlan = false;
    this.getPlan();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getPlan();
  }

  // Set PlanningId On Active Component Route
  setActiveComponentRoute(item: Planning) {
    this.subComponentList.forEach((componentInfo: any) => {
      componentInfo['routerLink'][0] = componentInfo['routerLink'][0] + '/' + item.id;
    })
  }

}

