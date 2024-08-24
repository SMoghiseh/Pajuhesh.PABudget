import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  TypeCodeList: any = [];
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
    this.getTypeCodeList();
    this.addEditForm = new FormGroup({
      yearUnionId: new FormControl(),
      typeCode: new FormControl(null),
      title: new FormControl(null),
    });

    if (this.mode === 'edit') {
      debugger;
      this.getRowData(this.inputData.id);
    }
    this.route.params.subscribe((param: any) => {
      if (param.id) {
        this.addEditForm.patchValue({
          yearUnionId: param.id,
         
        });
      }
    });
  }
  getRowData(id: number) {
    debugger;
    this.httpService
      .get<any>(AssemblyAssignments.apiAddressDetails + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }
  getTypeCodeList() {
    this.httpService
      .get<AssemblyAssignments[]>(
        AssemblyAssignments.apiAddressTypeCode + 'List',
        {
          withOutPagination: true,
        }
      )
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.TypeCodeList = response.data.result;
        }
      });
  }

  addEditAssemblyAssignmentDetails() {
    debugger;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = AssemblyAssignments.apiAddressDetails + 'Create';
      // this.mode === 'insert'
      //   ? AssemblyAssignments.apiAddressDetails + 'Create'
      //   : AssemblyAssignments.apiAddressDetails + 'Update';

      this.isLoadingSubmit = true;
      this.httpService
        .post<AssemblyAssignments>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'assemblyAssignmentDetails',
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
