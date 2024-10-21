import { Component } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  Vision,
  KeyTypecode,
  PlanningValue,
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
  selector: 'PABudget-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.scss'],
  providers: [ConfirmationService],
})
export class VisionComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Vision[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new Vision();
  pId!: string;
  mode!: string;
  planningId = 0;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  planningValueList: any = [];
  planingList: any = [];
  KeyTypeList: any = [];

  subComponentList = [
    {
      label: 'اهداف ',
      icon: 'pi pi-fw pi-plus',
      routerLink: ['/Operation/BigGoal'],
    },
  ];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getplanningValueLst();
    this.getkeyTypeCodeLst();

    this.searchForm = new FormGroup({
      planningValueId: new FormControl(null),
      title: new FormControl(null),
      visionCode: new FormControl(null),
      keyTypeCode: new FormControl(null),
    });
    this.planningId = Number(this.route.snapshot.paramMap.get('id'))
  }

  getplanningValueLst() {
    this.httpService
      .post<PlanningValue[]>(PlanningValue.apiAddress + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.planningValueList = response.data.result;
        }
      });
  }

  getkeyTypeCodeLst() {
    this.httpService
      .get<KeyTypecode[]>(KeyTypecode.vissionApiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.KeyTypeList = response.data.result;
        }
      });
  }

  getVision(event?: LazyLoadEvent) {
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
    const url = Vision.apiAddress + 'List';
    this.httpService
      .post<Vision[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Vision()];
        })
      )
      .subscribe(res => {
        this.data = this.addSubComponentList(res);
      });
  }


  addSubComponentList(data: any) {
    data.forEach((row: any) => {

      row['componentList'] = [];
      let array = this.subComponentList;
      let snapshotParams = '/' + Number(this.route.snapshot.paramMap.get('id'));

      array = array.map(com => {
        let params = snapshotParams + '/' + row.id;
        let route = com['routerLink'][0].concat(params);
        return { ...com, routerLink: [route] }
      })

      row['componentList'].push(...array);

    });
    return data;
  }

  addPlan() {
    this.modalTitle = 'افزودن چشم انداز  ';
    this.mode = 'insert';
    this.isOpenAddEditPlan = true;
  }

  editRow(data: Vision) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: Vision) {
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
        .get<Vision>(
          UrlBuilder.build(Vision.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'vision',
              life: 8000,
              severity: 'success',
              detail: ` چشم انداز  ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getVision();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditPlan = false;
    this.getVision();
  }

  clearSearch() {
    this.searchForm.reset();
    this.getVision();
  }


}
