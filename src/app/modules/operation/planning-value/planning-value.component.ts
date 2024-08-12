import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder, PlanningValue, Planning, KeyTypecode
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'PABudget-planning-Value',
  templateUrl: './planning-value.component.html',
  styleUrls: ['./planning-value.component.scss'],
  providers: [ConfirmationService]

})
export class PlanningValueComponent {

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: PlanningValue[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new PlanningValue();
  pId!: string;
  mode!: string;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  planingList: any = [];
  KeyTypeList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getkeyTypeCodeLst();
    this.getPlaningList();

    this.searchForm = new FormGroup({
      keyTypeCode: new FormControl(null),
      title: new FormControl(null),
      planingId: new FormControl(null),
    });
  }


  getPlaningList() {
    this.httpService
      .post<Planning[]>(Planning.apiAddress + 'List', { "withOutPagination": true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.planingList = response.data.result;
        }
      });
  }

  getkeyTypeCodeLst() {
    this.httpService
      .get<KeyTypecode[]>(KeyTypecode.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.KeyTypeList = response.data.result;
        }
      });
  }

  getPlan(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.searchForm.value;
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
      PlanningValue.apiAddress + 'List';
    this.httpService
      .post<PlanningValue[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new PlanningValue()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addPlan() {
    this.modalTitle = 'افزودن ارزش ها  ';
    this.mode = 'insert';
    this.isOpenAddEditPlan = true;
  }

  editRow(data: PlanningValue) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: PlanningValue) {
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
        .get<PlanningValue>(
          UrlBuilder.build(
            PlanningValue.apiAddress + 'Delete',
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
              detail: ` ارزش ها  ${title}`,
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

}

