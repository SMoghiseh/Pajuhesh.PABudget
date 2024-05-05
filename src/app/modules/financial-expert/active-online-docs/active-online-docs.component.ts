import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  CreateOnlineDocDefinition,
  Publisher,
  Pagination,
  DocumentType,
  UrlBuilder,
} from '@shared/models/response.model';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-active-online-docs',
  templateUrl: './active-online-docs.component.html',
  styleUrls: ['./active-online-docs.component.scss'],
})
export class ActiveOnlineDocsComponent implements OnInit {
  @Output() Hide: EventEmitter<any> = new EventEmitter();
  /** Table data total count. */

  activeOnlineAdvertForm!: FormGroup;
  totalCount!: number;
  nodes: any;
  /** Main table data. */
  onlineDocument: CreateOnlineDocDefinition[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 15;

  lazyLoadEvent?: LazyLoadEvent;

  selectedRow = new CreateOnlineDocDefinition();

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
    this.getDocumentTypeTree();

    this.activeOnlineAdvertForm = new FormGroup({
      documentType: new FormControl(),
      isExpired: new FormControl(false),
    });
  }

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
      withOutPagination: true,
      docTypeId:
        this.activeOnlineAdvertForm.controls['documentType'].value?.key,
      isExpireToday: this.activeOnlineAdvertForm.controls['isExpired'].value,
    };

    this.loading = true;

    this.httpService
      .post<CreateOnlineDocDefinition[]>(
        Publisher.apiAddress + '/OnlineDoc',
        body
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result) {
            if (response.data.totalCount)
              this.totalCount = response.data.totalCount;
            return response.data.result;
          } else return [new CreateOnlineDocDefinition()];
        })
      )
      .subscribe(
        onlineDocument => (this.onlineDocument = onlineDocument)
      );
  }

  onSubmit() {
    console.log(this.selectedRow);
    this.Hide.emit(this.selectedRow);
  }

  onAddAdvert(data: Publisher) {
    this.router.navigate(['/FinancialexpertDocuments/Registration'], {
      queryParams: {
        docTypeId: data.docTypeId,
        documentTypeName: data.docTypeCodeTypeName,
        id: data.id,
      },
    });
  }

  getDocumentTypeTree() {
    this.httpService
      .get<DocumentType[]>(
        UrlBuilder.build(DocumentType.apiAddress + '/tree/selectable', '')
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new DocumentType()];
        })
      )
      .subscribe(documentTypes => (this.nodes = documentTypes));
  }
}
