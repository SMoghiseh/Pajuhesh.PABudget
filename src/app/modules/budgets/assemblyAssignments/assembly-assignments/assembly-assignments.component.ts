import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { AssemblyAssignments, Company } from '@shared/models/response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'PABudget-assembly-assignments',
  templateUrl: './assembly-assignments.component.html',
  styleUrls: ['./assembly-assignments.component.scss'],
})
export class AssemblyAssignmentsComponent {
  // form property
  searchForm!: FormGroup;
  MeetingTopicList: any = [];
  mode!: string;
  modalTitle = '';
  addEditData = new AssemblyAssignments();
  companyList: any = [];
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  lazyLoadEvent?: LazyLoadEvent;
  totalCount!: number;
  loading = false;
  first = 0;
  data: AssemblyAssignments[] = [];
  isOpenAddEditAssemblyAssignment = false;
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void { debugger
    this.getAssemblyAssignmentsLst();
    this.getCompanyLst();
    this.searchForm = new FormGroup({
      budgetPeriodId: new FormControl(null),
      meetingId: new FormControl(null),
      typeCode: new FormControl(null),
      companyId: new FormControl(null),
      title: new FormControl(null),
      meetingDate: new FormControl(null),
    });
  }

  getAssemblyAssignmentsLst() { debugger
    this.httpService
      .get<AssemblyAssignments[]>(AssemblyAssignments.apiAddressMeetingTopic)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.MeetingTopicList = response.data.result;
        }
      });
  }
  addBudgetSourceUse() { 
    this.modalTitle = 'افزودن منابع و مصارف جدید';
    this.isOpenAddEditAssemblyAssignment = true;
    this.addEditData.type = 'insert';
  }
  getAssemblyAssignmentList(event?: LazyLoadEvent) { debugger}
  deleteRow(){}
  editRow(){}
  getCompanyLst() {
    this.httpService
      .post<Company[]>(Company.apiAddressDetailCo + 'List', {
        withOutPagination: true,
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }
  reloadData() {
    this.isOpenAddEditAssemblyAssignment = false;
    this.getAssemblyAssignmentList();
  }
  clearSearch() {
    this.searchForm.reset();
    this.getAssemblyAssignmentList();
  }
}
