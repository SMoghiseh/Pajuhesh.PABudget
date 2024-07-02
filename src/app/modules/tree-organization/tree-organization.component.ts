import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { CompanyTree, listReportForTree } from '@shared/models/response.model';

@Component({
  selector: 'PABudget-tree-organization',
  templateUrl: './tree-organization.component.html',
  styleUrls: ['./tree-organization.component.scss']
})
export class TreeOrganizationComponent {
  companyList: CompanyTree[] = []
  filterList: any = []
  selectedFilterTab = new listReportForTree();

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.getFilteredCompanyList();
  }

  getFilteredCompanyList() {
    this.httpService
      .get<listReportForTree[]>(listReportForTree.apiAddress)
      .subscribe(response => {
        if (response.data) {
          this.filterList = response.data;
          this.selectedFilterTab = this.filterList[0];
          this.getAllCompanyList(this.selectedFilterTab.id);
        }
      });
  }

  getAllCompanyList(id: number) {
    this.httpService
      .post<CompanyTree[]>(CompanyTree.apiAddress, { reportId: id })
      .subscribe(response => {
        if (response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  onSelectFilterTab(item: listReportForTree) {
    this.selectedFilterTab = item;
    this.getAllCompanyList(item.id);
  }

  isSelectedItem(item: listReportForTree) {
    return item.id == this.selectedFilterTab.id ? true : false;
  }

  toggleList(element: HTMLElement, downIcon: HTMLElement, upIcon: HTMLElement) {

    Array.from(element.children).forEach(el => {
      if (el.classList.contains('company'))
        el.classList.add('hide')
    })
    downIcon.classList.add('hide');
    upIcon.classList.remove('hide');
    upIcon.classList.add('show');

  }

  toggleList2(element: HTMLElement, downIcon: HTMLElement, upIcon: HTMLElement) {

    Array.from(element.children).forEach(el => {
      if (el.classList.contains('company'))
        el.classList.remove('hide')
    })

    downIcon.classList.remove('hide');
    upIcon.classList.add('hide');
    upIcon.classList.remove('show');

  }

  returnTooltip(data: any) {

    if (data.charAt(0) === '-') {
      data = data.substring(1);
    }
    let a = '-'

    return data.concat(a);
  }


  routeToDashboard() {
    this.router.navigate(['/default/Dashboard']);
  }

}
