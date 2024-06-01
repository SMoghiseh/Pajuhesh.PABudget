import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { Company, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
})
export class CompanyDetailComponent implements OnInit {
  infoLst = new Company();

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getProfileCoInfo(params['id']);
    });
  }

  getProfileCoInfo(id: string) {
    const body = {
      companyId: id,
    };
    this.httpService
      .post<Company[]>(
        UrlBuilder.build(Company.apiAddressDetailCo + 'list', ''),
        body
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new Company()];
        })
      )
      .subscribe(info => {
        this.infoLst = info[0];
      });
  }
}
