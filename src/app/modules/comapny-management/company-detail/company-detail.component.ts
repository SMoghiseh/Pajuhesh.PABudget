import { data } from './../company-profile/plan-badget-detail/plans/strategy-map/graph/graph.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { Company, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
})
export class CompanyDetailComponent implements OnInit {
  infoLst = new Company() ;


  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getProfileCoInfo(params['id']);
    });
  }

  getProfileCoInfo(id: string) {    debugger
    const body = {
      companyId: id,
    };
    this.httpService
      .get<Company[]>(
        UrlBuilder.build(Company.apiAddressDetailCo + 'companyDetail/' + id , '')
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new Company()];
        })
      )
      .subscribe((info: any) => {
        this.infoLst = info;
      });
  }

  backClicked() {
    this._location.back();
  }

}
