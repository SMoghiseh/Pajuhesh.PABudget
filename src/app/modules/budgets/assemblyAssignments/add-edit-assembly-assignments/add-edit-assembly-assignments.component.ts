import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { AssemblyAssignments } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-add-edit-assembly-assignments',
  templateUrl: './add-edit-assembly-assignments.component.html',
  styleUrls: ['./add-edit-assembly-assignments.component.scss'],
})
export class AddEditAssemblyAssignmentsComponent {
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;
  inputData = new AssemblyAssignments();
  @Input()
  set data(data: AssemblyAssignments) {
    this.inputData = data;
  }
  get budgetPeriodId() {
    return this.addEditForm.get('budgetPeriodId');
  }
  get meetingId() {
    return this.addEditForm.get('meetingId');
  }
  get typeCode() {
    return this.addEditForm.get('typeCode');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get title() {
    return this.addEditForm.get('title');
  }
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.addEditForm = new FormGroup({
      budgetPeriodId: new FormControl(null),
      meetingId: new FormControl(null),
      typeCode: new FormControl(null),
      companyId: new FormControl(null),
      title: new FormControl(null),
    });
  }
  addEditAssemblyAssignment() {}
}
