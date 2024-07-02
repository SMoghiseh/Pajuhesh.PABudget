import { Component, OnDestroy, OnInit } from '@angular/core';
import { PreviousRouteService } from '@shared/services/previous-route.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'PABudget-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class AllCompanyReportsComponent implements OnInit , OnDestroy{
  selectedTab = 0;
  tabContent = 'tab_1';
  tabList = [
    { id: 1, title: 'بنگاه داری' },
    { id: 2, title: 'تامین اجتماعی ' },
    { id: 3, title: ' سازمانی' },
  ]

  private subscription?: Subscription;
  previousUrl = '';
   constructor(private previousRouteService: PreviousRouteService){}
  ngOnInit(): void {
    this.subscription = this.previousRouteService.getPreviousUrl().subscribe(url => {
      debugger
      this.previousUrl = url ? url : '';
    })
  }

  showTemplate(id: number, index: number) {
    this.selectedTab = index;
    this.tabContent = 'tab_' + id;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
