import { Component, OnInit } from '@angular/core';
import { Pagination, Period } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-period-definition',
  templateUrl: './period-definition.component.html',
  styleUrls: ['./period-definition.component.scss'],
})
export class PeriodDefinitionComponent implements OnInit {
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  totalCount!: number;
  data: Period[] = [];
  loading = false;
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  modalTitle = '';
  isOpenAddEditPeriod = false;
  addEditData = new Period();

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getPeriod();
  }

  getPeriod(event?: LazyLoadEvent) {
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
    };

    this.loading = true;

    this.first = 0;
    this.httpService
      .post<Period[]>(Period.apiAddress + 'ListByFilter', body)

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new Period()];
        })
      )
      .subscribe(res => (this.data = res));
  }

  addPeriod() {
    this.modalTitle = 'افزودن دوره بودجه جدید';
    this.addEditData.type1 = 'insert';
    this.addEditData.type2 = 'master';
    this.isOpenAddEditPeriod = true;
  }

  editRow(data: Period) {
    this.modalTitle = 'ویرایش دوره بودجه ' + data.title;
    this.addEditData = data;
    this.addEditData.type1 = 'edit';
    this.addEditData.type2 = 'master';
    this.isOpenAddEditPeriod = true;
  }

  deleteRow(data: Period) {}

  periodDetail(data: Period) {}
}
