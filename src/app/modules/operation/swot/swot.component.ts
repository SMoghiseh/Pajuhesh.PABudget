import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder, SWTO, KeyTypecode, Planning
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-swot',
  templateUrl: './swot.component.html',
  styleUrls: ['./swot.component.scss'],
  providers: [ConfirmationService]

})
export class SwotComponent {

  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: SWTO[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new SWTO();
  pId!: string;
  mode!: string;
  planningId = 0;


  // form property
  searchForm!: FormGroup;

  // dropdown data list
  planingList: any = [];
  typeCodeList: any = [];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getPlaningList();
    this.getTypeCodeList();

    this.searchForm = new FormGroup({
      title: new FormControl(null),
      typeCode: new FormControl(null),
      swotRank: new FormControl(null),
      swotCode: new FormControl(null),
      swoPriority: new FormControl(null)
    });
    this.planningId = Number(this.route.snapshot.paramMap.get('id'))
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

  getTypeCodeList() {
    this.httpService
      .get<KeyTypecode[]>(KeyTypecode.swotApiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
        }
      });
  }


  getData(event?: LazyLoadEvent) {
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
      planningValue: this.planningId,
      ...formValue,
    };

    this.first = 0;
    const url =
      SWTO.apiAddress + 'List';
    this.httpService
      .post<SWTO[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new SWTO()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addPlan() {
    this.modalTitle = 'افزودن swot  ';
    this.mode = 'insert';
    this.isOpenAddEditPlan = true;
  }

  editRow(data: SWTO) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: SWTO) {
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
        .get<SWTO>(
          UrlBuilder.build(
            SWTO.apiAddress + 'Delete',
            ''
          ) + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'swot',
              life: 8000,
              severity: 'success',
              detail: ` مورد   ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getData();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditPlan = false;
    this.getData();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getData();
  }

}

