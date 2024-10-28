import { Component, OnInit } from '@angular/core';
import {
  Pagination,
  UrlBuilder,
  Vision,
  Aspect,
  BigGoal,
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
  selector: 'PABudget-big-goal',
  templateUrl: './big-goal.component.html',
  styleUrls: ['./big-goal.component.scss'],
  providers: [ConfirmationService],
})
export class BigGoalComponent implements OnInit {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: BigGoal[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPlan = false;
  addEditData = new BigGoal();
  pId!: string;
  mode!: string;
  visionId!: number;

  // form property
  searchForm!: FormGroup;

  // dropdown data list
  visionList: any = [];
  aspectCodeList: any = [];

  subComponentList = [
    {
      label: ' ارتباط اهداف ',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/Operation/'],
    },
    {
      label: ' شاخص ارزیابی ',
      icon: 'pi pi-fw pi-eye',
      routerLink: ['/Operation/'],
    },
  ];

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.visionId = Number(this.route.snapshot.paramMap.get('visionId'));

    this.getVisionList();
    this.getAspectCodeList();

    this.searchForm = new FormGroup({
      bigGoalCode: new FormControl(null),
      title: new FormControl(null),
      aspectCode: new FormControl(null),
    });
  }

  getAspectCodeList() {
    this.httpService
      .get<Aspect[]>(Aspect.apiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.aspectCodeList = response.data.result;
        }
      });
  }

  getVisionList() {
    this.httpService
      .post<Vision[]>(Vision.apiAddress + 'List', { withOutPagination: true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.visionList = response.data.result;
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
      visionId: this.addEditData.visionId,
      ...formValue,
    };

    this.first = 0;
    const url = BigGoal.apiAddress + 'List';
    this.httpService
      .post<BigGoal[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new BigGoal()];
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
      const snapshotParams =
        '/' +
        Number(this.route.snapshot.paramMap.get('id')) +
        '/' +
        Number(this.route.snapshot.paramMap.get('visionId'));

      array = array.map(com => {
        const params = snapshotParams + '/' + row.id;
        const route = com['routerLink'][0].concat(params);
        return { ...com, routerLink: [route] };
      });

      row['componentList'].push(...array);
    });
    return data;
  }

  addPlan() {
    this.modalTitle = 'افزودن اهداف جدید  ';
    this.mode = 'insert';
    this.isOpenAddEditPlan = true;
  }

  editRow(data: BigGoal) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditPlan = true;
  }

  deleteRow(item: BigGoal) {
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
        .get<BigGoal>(
          UrlBuilder.build(BigGoal.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'bigGoal',
              life: 8000,
              severity: 'success',
              detail: `  مورد  ${title}`,
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
