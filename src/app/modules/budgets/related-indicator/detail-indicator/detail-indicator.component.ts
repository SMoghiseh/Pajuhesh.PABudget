import { Component } from '@angular/core';
import {
  AccountReportToItemData,
  Indicator,
} from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { map, tap } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-detail-indicator',
  templateUrl: './detail-indicator.component.html',
  styleUrls: ['./detail-indicator.component.scss'],
  providers: [ConfirmationService],
})
export class DetailIndicatorComponent {
  gridClass = 'p-datatable-sm';
  dataTableRows = 5;
  totalCount!: number;
  detailIndicatorList: any = [];
  lazyLoadEvent?: LazyLoadEvent;
  first = 0;
  selectedIndicatorId = 0;
  isLoadingSubmit = false;
  loading = false;
  changeList: any = [];
  rowSelected: any;
  formSubmitted = false;
  pageTitle = '';
  selectedCompanyId = 0;
  selectedPeriodId = 0;
  selectedReferenceIdId = 0;

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedIndicatorId = Number(this.route.snapshot.paramMap.get('id'));
    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedCompanyId = Number(params['companyId']);
      this.selectedPeriodId = Number(params['periodId']);
      this.selectedReferenceIdId = Number(params['referenceId']);
    });
    this.getDetailIndicatorList();
  }

  getDetailIndicatorList() {
    const url = Indicator.apiAddressIndicator + 'GetIndicatorDetailValue';
    let body = {
      indicatorId: this.selectedIndicatorId,
      companyId: this.selectedCompanyId,
      periodId: this.selectedPeriodId,
    };
    this.httpService
      .post<AccountReportToItemData>(url, body)
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [];
        })
      )
      .subscribe(res => {
        this.detailIndicatorList = res;
        this.formSubmitted = false;
      });
  }

  confirm() {
    this.addList();
    setTimeout(() => {
      this.getDetailIndicatorList();
    }, 1000);
  }

  addList() {
    const url = Indicator.apiAddressIndicator + 'CreateRefrenceIndicatorValue';
    const request: any = {};

    // data to post
    request['refrencesIndicatorId'] = this.selectedReferenceIdId;
    request['indicatorCompanyValue'] = this.changeList;

    this.isLoadingSubmit = true;
    this.httpService
      .post<Indicator>(url, request)
      .pipe(tap(() => (this.isLoadingSubmit = false)))
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'message',
            life: 8000,
            severity: 'success',
            // detail: ` عنوان  ${request.title}`,
            detail: ``,
            summary: 'با موفقیت ثبت شد',
          });
        }
        this.changeList = [];
        this.getDetailIndicatorList();
      });
  }

  onChangePrice(item: any) {
    const Indexfltr = this.changeList.findIndex(
      (x: any) => x.indicatorValueId === item.id
    );
    if (Indexfltr != -1) {
      this.changeList[Indexfltr].value = item.value;
    } else
      this.changeList.push({
        indicatorValueId: item.id,
        value: item.value,
      });

    item['changePrice'] = true;
    // this.updateBaseData(item);
  }

  updateBaseData(ItemChanged: any) {
    const indexToUpdate = this.detailIndicatorList.findIndex(
      (item: any) => item.id === ItemChanged.id
    );
    if (indexToUpdate != -1)
      this.detailIndicatorList[indexToUpdate]['value'] = ItemChanged.value;
  }

  onChangePercent(item: any) {
    item['changed'] = true;
  }
}
