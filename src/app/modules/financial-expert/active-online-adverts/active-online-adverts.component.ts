import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  CreateOnlineAdvertDefinition,
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
  selector: 'app-active-online-adverts',
  templateUrl: './active-online-adverts.component.html',
  styleUrls: ['./active-online-adverts.component.scss'],
})
export class ActiveOnlineAdvertsComponent implements OnInit {
  @Output() Hide: EventEmitter<any> = new EventEmitter();
  /** Table data total count. */

  activeOnlineAdvertForm!: FormGroup;
  totalCount!: number;
  nodes: any;
  /** Main table data. */
  onlineAdvertisment: CreateOnlineAdvertDefinition[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 15;

  lazyLoadEvent?: LazyLoadEvent;

  selectedRow = new CreateOnlineAdvertDefinition();

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
    this.getAdvertismentTypeTree();

    this.activeOnlineAdvertForm = new FormGroup({
      advertisementType: new FormControl(),
      isExpired: new FormControl(false),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get onlineAdvertisment from server. */
  getOnlineAdvertisment(event?: LazyLoadEvent) {
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
      advertTypeId:
        this.activeOnlineAdvertForm.controls['advertisementType'].value?.key,
      isExpireToday: this.activeOnlineAdvertForm.controls['isExpired'].value,
    };

    this.loading = true;

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
        onlineAdvertisment => (this.onlineAdvertisment = onlineAdvertisment)
      );
  }

  onSubmit() {
    console.log(this.selectedRow);
    this.Hide.emit(this.selectedRow);
  }

  onAddAdvert(data: Publisher) {
    this.router.navigate(['/Publisher/AddAdvert'], {
      queryParams: {
        advertisementTypeId: data.advertisementTypeId,
        advertisementTypeName: data.advertisementTypeName,
        id: data.id,
      },
    });
  }

  getAdvertismentTypeTree() {
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
      .subscribe(advertismentTypes => (this.nodes = advertismentTypes));
  }
}
