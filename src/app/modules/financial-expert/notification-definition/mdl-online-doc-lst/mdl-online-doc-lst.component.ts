import { Component, Output, EventEmitter } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  CreateOnlineAdvertDefinition,
  Pagination,
  Publisher,
} from '@shared/models/response.model';

import { map, tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-mdl-online-doc-lst',
  templateUrl: './mdl-online-doc-lst.component.html',
  styles: [``],
})
export class MdlOnlineDocLstComponent {
  @Output() Hide: EventEmitter<any> = new EventEmitter();

  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  onlineDocument: CreateOnlineAdvertDefinition[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  selectedRow = new CreateOnlineAdvertDefinition();

  first = 0;

  lazyLoadEvent?: LazyLoadEvent;

  constructor(private httpService: HttpService) { }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get onlineDocument from server. */
  getOnlineDocument(event?: LazyLoadEvent) {
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
      .post<CreateOnlineAdvertDefinition[]>(
        Publisher.apiAddress + '/OnlineAdvert',
        body
      )

      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new CreateOnlineAdvertDefinition()];
        })
      )
      .subscribe(
        onlineDocument => (this.onlineDocument = onlineDocument)
      );
  }

  // onSubmit() {
  //   this.Hide.emit(this.selectedRow);
  // }

  onRowDblClick(e: any, data: any) {
    this.Hide.emit(data);
  }
}
