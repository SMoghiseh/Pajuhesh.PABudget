import { Component } from '@angular/core';
import {
  Pagination,
  PersonelNo,
  UrlBuilder,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-personel-no',
  templateUrl: './personel-no.component.html',
  styleUrls: ['./personel-no.component.scss'],
  providers: [ConfirmationService],
})
export class PersonelNoComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: PersonelNo[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPersonelNo = false;
  addEditData = new PersonelNo();
  pId!: string;

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  getPersonelNo(event?: LazyLoadEvent) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      periodId: parseInt(this.pId),
    };

    this.loading = true;

    this.first = 0;
    const url = PersonelNo.apiAddress + 'ListByFilter';
    this.httpService
      .post<PersonelNo[]>(url, body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new PersonelNo()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addPersonelNo() {
    this.modalTitle = 'افزودن بودجه پرسنل جدید';
    this.addEditData.type = 'insert';
    this.isOpenAddEditPersonelNo = true;
  }

  editRow(data: PersonelNo) {
    debugger
    this.modalTitle = 'ویرایش بودجه پرسنل ' + data.periodTitle;
    this.addEditData = data;
    this.addEditData.type = 'edit';
    this.isOpenAddEditPersonelNo = true;
  }

  deleteRow(period: PersonelNo) {
    if (period && period.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف بودجه پرسنل اطمینان دارید؟',
        header: `عنوان ${period.periodTitle}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deletePersonelNo(period.id, period.periodTitle),
      });
  }

  deletePersonelNo(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<PersonelNo>(
          UrlBuilder.build(PersonelNo.apiAddress + 'DELETE', '') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.first = 0;
            this.messageService.add({
              key: 'personelNo',
              life: 8000,
              severity: 'success',
              detail: `بودجه پرسنل ${title}`,
              summary: 'با موفقیت حذف شد',
            });
            this.getPersonelNo();
          }
        });
    }
  }

  reloadData() {
    this.isOpenAddEditPersonelNo = false;
    this.getPersonelNo();
  }
}
