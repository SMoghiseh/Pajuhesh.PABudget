import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { AssemblyAssignments } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-assembly-assignments-details',
  templateUrl: './add-edit-assembly-assignments-details.component.html',
  styleUrls: ['./add-edit-assembly-assignments-details.component.scss'],
})
export class AddEditAssemblyAssignmentsDetailsComponent {
  addEditForm!: FormGroup;
  isLoadingSubmit = false;
  inputData = new AssemblyAssignments();
  @Input() mode = '';
  @Input() set data1(data: AssemblyAssignments) {
    this.inputData = data;
  }
  @Output() isSuccess = new EventEmitter<boolean>();
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.addEditForm = new FormGroup({});
  }

  addEditAssemblyAssignmentDetails() {
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url =
        this.mode === 'insert'
          ? AssemblyAssignments.apiAddress + 'Create'
          : AssemblyAssignments.apiAddress + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<AssemblyAssignments>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'mission',
              life: 8000,
              severity: 'success',
              detail: ` عنوان  ${request.title}`,
              summary:
                this.mode === 'insert'
                  ? 'با موفقیت درج شد'
                  : 'با موفقیت بروزرسانی شد',
            });
            this.isSuccess.emit(true);
          }
        });
    }
  }
}
