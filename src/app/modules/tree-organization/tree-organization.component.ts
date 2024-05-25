import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { CompanyTree } from '@shared/models/response.model';

@Component({
  selector: 'PABudget-tree-organization',
  templateUrl: './tree-organization.component.html',
  styleUrls: ['./tree-organization.component.scss']
})
export class TreeOrganizationComponent {
  companyList: CompanyTree[] = []

  constructor(private router: ActivatedRoute, @Inject(DOCUMENT) document: Document,
    private httpService: HttpService) {
    if (router.snapshot.data['showSideBar'] == false) {
      this.changeStyleOfSideBar();
    }
  }

  ngOnInit(): void {
    this.getAllCompanyList();
  }

  getAllCompanyList() {
    this.httpService
      .get<CompanyTree[]>(CompanyTree.apiAddress)
      .subscribe(response => {
        if (response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  changeStyleOfSideBar() {
    let sidebar: HTMLCollection = document.getElementsByClassName('sidebar');
    let sidebar0: any = sidebar[0];
    sidebar0.style.display = 'none';
    let contentBody: HTMLCollection = document.getElementsByClassName('content-body');
    let contentBody0: any = contentBody[0];
    contentBody0.style.margin = '5rem 4rem 1.43rem';
  }

}
