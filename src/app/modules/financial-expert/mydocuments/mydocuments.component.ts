import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DocumentStatus,
  DocumentType,
  Publisher,
  Report,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { TransferServices } from '../../../config.service';
import { DatePipe } from '@angular/common';
import { HttpService } from '@core/http/http.service';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-mydocuments',
  templateUrl: './mydocuments.component.html',
  styleUrls: ['./mydocuments.component.scss'],
})
export class MydocumentsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public datePipe = new DatePipe('en-US');
  apiUrl = Publisher.apiAddressSearch;
  _searchData: any;
  statusLst: any = [];
  isFailed = false;

  accessToActions = ['register-amendment', 'workflow'];
  /*--------------------------
  # SEARCH
  --------------------------*/
  /** گروه فرم جستجو کاربر */
  searchReportForm!: FormGroup;

  /** مدل جستجو کاربر */
  searchReportModel = new Report();

  sub: any;

  filterData: any;

  /** نام شرکت */
  get company() {
    return this.searchReportForm.get('company');
  }
  /** عنوان اسناد */
  get description() {
    return this.searchReportForm.get('description');
  }
  /** کد */
  get code() {
    return this.searchReportForm.get('code');
  }
  /** زمان ارسال */
  get sendDate() {
    return this.searchReportForm.get('sendDate');
  }

  constructor(
    private jDateCalculatorService: JDateCalculatorService,
    private transferServices: TransferServices,
    private httpService: HttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.getDocumentStatus();
    this.searchReportForm = new FormGroup({
      company: new FormControl(this.searchReportModel.company),
      description: new FormControl(this.searchReportModel.description),
      code: new FormControl(this.searchReportModel.code),
      sendDate: new FormControl(this.searchReportModel.sendDate),
    });

    this.sub = this.route?.data?.subscribe((data: any) => {
      if (data.type == 'FailedAdverts') {
        this.filterData = {
        };
        this.isFailed = true;
      } else this.filterData = new Publisher();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this._searchData = this.filterData;
  }

  /*--------------------------
  # TABLE
  --------------------------*/

  getReportList() {
    const { company, description, code, sendDate } =
      this.searchReportForm.value;

    const searchModel = new Report();

    searchModel.companyName = company;

    searchModel.description = description;

    searchModel.code = Number(PersianNumberService.toEnglish(code));


    searchModel.sendDate = sendDate
      ? this.datePipe.transform(
        this.jDateCalculatorService.convertToGeorgian(
          sendDate?.getFullYear(),
          sendDate?.getMonth(),
          sendDate?.getDate()
        ),
        'yyyy-MM-ddTHH:mm:ss'
      )
      : null;

    this._searchData = searchModel;
  }

  getDocumentStatus() {
    const body = {};
    this.httpService
      .post<DocumentType[]>(DocumentStatus.apiAddress, body)

      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new DocumentType()];
        })
      )
      .subscribe(statusLst => (this.statusLst = statusLst));
  }
}
