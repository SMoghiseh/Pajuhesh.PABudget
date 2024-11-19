import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Location } from '@angular/common';
import {
  UrlBuilder,
  CEO,
  Company,
  years,
  AllDocs,
  DocumentType,
  Publisher,
} from '@shared/models/response.model';
import { map } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-all-documents',
  templateUrl: './all-documents.component.html',
  styleUrls: ['./all-documents.component.scss'],
})
export class AllDocumentsComponent implements OnInit, AfterViewInit {
  mySubCompanies: Company[] = [];

  yearsLst: years[] = [];

  addNewAdvertTagTypeForm!: FormGroup;

  loginData: any;

  advertTypeId!: number;

  apiUrl = AllDocs.apiAddress;

  accessToActions = ['edit-tag'];

  responsiveOptions: any;

  responsiveOptionsSubsets: any;

  Subsets: Company[] = [];

  oldHoldingId!: number;

  oldCompanyId!: number | null;

  oldSelectMounth!: number;

  oldSelectYear!: number;

  isSelectHolding = false;

  isSelectCo = false;

  hasAccessAllSubs: any;

  hasAccessAllHoldings: any;

  advertTypeLst: DocumentType[] = [];

  mounthsLst: any;

  selectedHoldingId: null | number = null;

  selectedCompanyId: null | number = null;

  selectedYearId: null | number = null;

  selectedMounthId: null | number = null;

  _searchData: any;

  selectedAdvertTypeName = '';

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private rd: Renderer2,
    private location: Location
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '2260px',
        numVisible: 6,
        numScroll: 6,
      },
      {
        breakpoint: '1960px',
        numVisible: 5,
        numScroll: 5,
      },
      {
        breakpoint: '1660px',
        numVisible: 4,
        numScroll: 4,
      },
      {
        breakpoint: '1360px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1060px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '760px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    this.responsiveOptionsSubsets = [
      {
        breakpoint: '1860px',
        numVisible: 5,
        numScroll: 5,
      },
      {
        breakpoint: '1560px',
        numVisible: 4,
        numScroll: 4,
      },
      {
        breakpoint: '1260px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '960px',
        numVisible: 2,
        numScroll: 2,
      },
    ];
  }

  ngOnInit(): void {
    const loginData = localStorage.getItem('loginData');
    this.loginData = loginData ? JSON.parse(loginData) : {};

    this.addNewAdvertTagTypeForm = new FormGroup({
      companyId: new FormControl(),
      yearValue: new FormControl(),
      withSubsets: new FormControl(true),
    });

    this.route.queryParams.subscribe((params: any) => {
      if (params.advertTypeId) {
        this.selectedAdvertTypeName = params.title;
        this.advertTypeId = params.advertTypeId;
        this.addNewAdvertTagTypeForm.patchValue({
          companyId: parseInt(params.companyId),
        });
        this.selectedCompanyId = parseInt(params.companyId);
        this.getDocumentType();
      }
    });
  }

  ngAfterViewInit() {
    const input = new Publisher();
  }

  /*--------------------------
  # TABLE
  --------------------------*/
  /**
   *  Get reports from server.
   * @param event primeNG lazy load event
   * @param searchModel search report model
   */
  getReportList() {
    let coId = null;
    if (this.selectedCompanyId) coId = this.selectedCompanyId;
    else if (this.selectedHoldingId) coId = this.selectedHoldingId;

    let yearId = null;
    if (this.selectedMounthId) yearId = this.selectedMounthId;
    else if (this.selectedYearId) yearId = this.selectedYearId;

    const data = {
      withOutPagination: false,
      financialYearId: yearId,
      companyId: coId,
      withSubsets: this.addNewAdvertTagTypeForm.get('withSubsets')?.value,
      advertTypeId: parseInt(this.advertTypeId?.toString()),
    };
    this._searchData = data;
  }

  getMySubCompanies(id: number) {
    this.httpService
      .get<Company[]>(
        UrlBuilder.build(CEO.apiAddress + '/MySubCompanies/' + id, '')
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            this.hasAccessAllHoldings = response.data.hasAccessAll;
            const trueFirst = response.data.result.sort(
              (a, b) => Number(b.isMyCompany) - Number(a.isMyCompany)
            );
            return trueFirst;
          } else return new Array<Company>();
        })
      )
      .subscribe(mySubCompanies => {
        if (mySubCompanies[0].isMyCompany) {
          this.selectedHoldingId = mySubCompanies[0].id;
          this.getSubsets(mySubCompanies[0].id);
        } else this.getSubsets(-1);
        this.oldHoldingId = mySubCompanies[0].id;
        this.mySubCompanies = mySubCompanies;
      });
  }

  getSubsets(id: number) {
    this.oldCompanyId = null;
    this.httpService
      .get<Company[]>(
        UrlBuilder.build(CEO.apiAddress + '/MySubCompanies/' + id, '')
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            this.hasAccessAllSubs = response.data.hasAccessAll;
            const trueFirst = response.data.result.sort(
              (a, b) => Number(b.isMyCompany) - Number(a.isMyCompany)
            );
            return trueFirst;
          } else return new Array<Company>();
        })
      )
      .subscribe(Subsets => {
        if (Subsets[0].isMyCompany) {
          this.selectedCompanyId = Subsets[0].id;
          this.oldCompanyId = Subsets[0].id;
        }
        this.Subsets = Subsets;
        this.getYears();
      });
  }

  getYears() {
    const request = {
      pageSize: 12,
      pageNumber: 1,
      withOutPagination: false,
      isAcive: true,
    };
    this.httpService
      .post<years[]>(
        UrlBuilder.build(years.apiAddress + '/YearType/list', ''),
        request
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return new Array<years>();
        })
      )
      .subscribe(years => {
        this.yearsLst = years;
        this.selectedYearId = years[years.length - 1].id;
        this.getMounth(this.selectedYearId);
        this.oldSelectYear = this.selectedYearId;
      });
  }

  getMounth(id: number) {
    const request = {
      pageSize: 12,
      pageNumber: 1,
      withOutPagination: false,
      isAcive: true,
      parentId: id,
    };
    this.httpService
      .post<years[]>(
        UrlBuilder.build(years.apiAddress + '/MounthType/List', ''),
        request
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return new Array<years>();
        })
      )
      .subscribe(mounths => {
        this.mounthsLst = mounths;
        this.getReportList();
      });
  }

  onSelectCompany(company: Company) {
    this.selectedCompanyId = null;
    this.selectedHoldingId = company.id;
    if (!this.hasAccessAllHoldings && !company.isMyCompany) return;
    else {
      if (company.id === this.oldHoldingId) {
        this.isSelectHolding = !this.isSelectHolding;
        if (!this.isSelectHolding) {
          this.selectedHoldingId = null;
          this.deSelectCoItem('company', company.id);
          this.getSubsets(-1);
        } else {
          this.selectCoItem('company', company.id);
          this.getSubsets(company.id);
        }
      } else {
        this.isSelectHolding = true;
        if (this.oldHoldingId) {
          this.deSelectCoItem('company', this.oldHoldingId);
          this.selectCoItem('company', company.id);
        } else this.selectCoItem('company', company.id);
        this.oldHoldingId = company.id;
        this.getSubsets(company.id);
      }
    }
  }

  onSelectSubsets(company: Company) {
    this.selectedCompanyId = company.id;
    if (!this.hasAccessAllSubs && !company.isMyCompany) return;
    else {
      if (company.id === this.oldCompanyId && this.hasAccessAllSubs) {
        this.isSelectCo = !this.isSelectCo;
        if (!this.isSelectCo) {
          this.selectedCompanyId = null;
          this.deSelectCoItem('co', company.id);
        } else {
          this.selectCoItem('co', company.id);
        }
      } else {
        this.isSelectCo = true;
        if (this.oldCompanyId) {
          this.deSelectCoItem('co', this.oldCompanyId);
          this.selectCoItem('co', company.id);
        } else this.selectCoItem('co', company.id);
        this.oldCompanyId = company.id;
        // this.getSubsets(company.id);
      }
      this.getReportList();
    }
  }

  onSelectMounth(id: number) {
    this.selectedMounthId = id;
    if (this.oldSelectMounth) {
      this.deSelectYearItem('m', this.oldSelectMounth);
      this.selectYearItem('m', id);
    } else this.selectYearItem('m', id);
    this.oldSelectMounth = id;
    this.getReportList();
  }

  selectYearItem(type: string, id: number) {
    const el = document.getElementById(type + '-' + id);
    this.rd.addClass(el, 'select-year');
  }

  deSelectYearItem(type: string, id: number) {
    const el = document.getElementById(type + '-' + id);
    this.rd.removeClass(el, 'select-year');
  }

  selectCoItem(type: string, id: number) {
    const el = document.getElementById(type + '-' + id);
    this.rd.addClass(el, 'select-co-item');
  }

  deSelectCoItem(type: string, id: number) {
    const el = document.getElementById(type + '-' + id);
    this.rd.removeClass(el, 'select-co-item');
  }

  onSelectYear(id: number) {
    this.selectedYearId = id;
    if (this.oldSelectYear) {
      this.deSelectYearItem('y', this.oldSelectYear);
      this.selectYearItem('y', id);
    } else this.selectYearItem('y', id);
    this.oldSelectYear = id;
    this.getMounth(id);
  }

  onBack() {
    this.location.back();
  }

  getDocumentType() {
    this.httpService
      .get<DocumentType[]>(
        UrlBuilder.build(
          DocumentType.apiAddress + '/similar/' + this.advertTypeId,
          ''
        )
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return new Array<DocumentType>();
        })
      )
      .subscribe(advertTypeLst => {
        this.advertTypeLst = advertTypeLst;
      });
  }

  onChangeAdvertType(advertT: DocumentType) {
    this.advertTypeId = advertT.id;
    this.selectedAdvertTypeName = advertT.title;
    this.getReportList();
    this.getDocumentType();
  }
}
