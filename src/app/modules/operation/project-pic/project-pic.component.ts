import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { AppConfigService } from '@core/services/app-config.service';
import {
  AssetAttachment,
  Pagination,
  ProjectPic,
  UrlBuilder,
} from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, of, tap } from 'rxjs';

@Component({
  selector: 'PABudget-project-pic',
  templateUrl: './project-pic.component.html',
  styleUrls: ['./project-pic.component.scss'],
  providers: [ConfirmationService],
})
export class ProjectPicComponent {
  searchForm!: FormGroup;
  modalTitle = '';
  mode!: string;
  multiMediaId!: number;
  isOpenAddEditProjectPic = false;
  budgetPeriodList: any = [];
  periodDetailList: any = [];
  OperationPeriodList: any = [];
  unitList: any = [];
  sourceTypeList: any = [];
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  data: ProjectPic[] = [];
  first = 0;
  RouteId: any;
  fileSelected: AssetAttachment = new AssetAttachment();
  addEditData = new ProjectPic();
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private jDateCalculatorService: JDateCalculatorService,
    private config: AppConfigService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.searchForm = new FormGroup({
      projectId: new FormControl(null),
      title: new FormControl(null),
      code: new FormControl(null),
      picDate: new FormControl(null),
      description: new FormControl(null),
      picId: new FormControl(null),
      picTitle: new FormControl(null),
    });
    this.route.params.subscribe(params => {
      this.RouteId = params['id'];
      this.searchForm.patchValue({ projectId: parseInt(this.RouteId) });
    });
  }

  addProjectPic() {
    this.modalTitle = 'پیوست تصاویر و مستندات پروژه  ';
    this.mode = 'insert';
    this.isOpenAddEditProjectPic = true;
  }

  editRow(data: ProjectPic) {
    this.modalTitle = 'ویرایش ' + '"' + data.title + '"';
    this.addEditData = data;
    this.mode = 'edit';
    this.isOpenAddEditProjectPic = true;
  }
  deleteRow(item: ProjectPic) {
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
        accept: () => this.deleteProjectPic(item.id, item.title),
      });
  }
  deleteProjectPic(id: number, periodTitle: string) {
    if (id && periodTitle) {
      this.httpService
        .get<ProjectPic>(
          UrlBuilder.build(ProjectPic.apiAddress + 'Delete', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'Pic',
              life: 8000,
              severity: 'success',
              detail: ` برنامه  ${periodTitle}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getProjectPic();
          }
        });
    }
  }

  getProjectPic() {
    // if (event) this.lazyLoadEvent = event;

    // this.route.params.subscribe(params => {
    //   let RouteId = params['id'];

    // });

    this.first = 0;
    const url = ProjectPic.apiAddress + 'List' + `/${this.RouteId}`;
    this.httpService
      .get<ProjectPic[]>(url)

      .pipe(
        tap(() => (this.loading = false)),

        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new ProjectPic()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  downloadFile(multiMediaId: any) {
    this.httpService
      .get<AssetAttachment[]>(
        AssetAttachment.downloadApiAddress + `/${multiMediaId}`
      )
      .subscribe(response => {
        if (response.data.result) {
          // a = response.data.result;
        }
      });
  }
  clearSearch() {
    this.searchForm.reset();
    this.getProjectPic();
  }

  closeModal() {
    this.isOpenAddEditProjectPic = false;
  }

  reloadData() {
    this.isOpenAddEditProjectPic = false;
    this.getProjectPic();
  }
}
