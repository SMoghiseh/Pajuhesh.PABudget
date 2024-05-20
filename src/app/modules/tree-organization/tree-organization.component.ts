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


    // this.companyList = [
    //   {
    //     title: 'دبیرخانه هیات امنایی سازمان تامین اجتماعی و صندوق',
    //     children: [
    //       {
    //         title: 'صندوق بازنشستگی کشوری',
    //         children: [
    //           { title: '1سرمایه گذاری آتیه صبا' },
    //           { title: '1سرمایه گذاری  صندوقبازنشستگی کشوری' },
    //         ]
    //       },
    //       {
    //         title: 'بانک توسعه تعاون',
    //         children: [
    //           { title: '2سرمایه گذاری  صندوقبازنشستگی کشوری' },
    //         ]
    //       },
    //       {
    //         title: 'صندوق حمایت و بازنشستگی آینده ساز ',
    //         children: [
    //           { title: '3سرمایه گذاری آتیه صبا' },
    //           { title: '3گروه مدیریت ارزش سرمایه' },
    //           { title: '3گروه مدیریت ارزش سرمایه' }
    //         ]
    //       },
    //       {
    //         title: '  صندوق بیمه اجتماعی',
    //         children: [
    //           { title: '4سرمایه گذاری آتیه صبا' },
    //           { title: '4سرمایه گذاری  صندوقبازنشستگی کشوری' },
    //           { title: '4گروه مدیریت ارزش سرمایه' }
    //         ]
    //       },
    //       {
    //         title: 'صندوق حمایت و بازنشستگی  کارکنان فولاد ',
    //         children: [
    //           { title: '5سرمایه گذاری آتیه صبا' },
    //           { title: '5سرمایه گذاری  صندوقبازنشستگی کشوری' },
    //           { title: '5گروه مدیریت ارزش سرمایه' }
    //         ]
    //       },
    //     ]
    //   }
    // ]

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
