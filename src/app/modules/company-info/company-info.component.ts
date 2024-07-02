import { Component } from '@angular/core';

@Component({
  selector: 'PABudget-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class AllCompanyReportsComponent {
  selectedTab= 0 ; 
  tabContent = 'tab_1';
  tabList = [
    { id: 1, title: 'بنگاه داری' },
    { id: 2, title: 'تامین اجتماعی ' },
    { id: 3, title: ' سازمانی' },
  ]







  showTemplate(id: number, index: number) {
    this.selectedTab = index;
    this.tabContent = 'tab_' + id ; 
  }
}
