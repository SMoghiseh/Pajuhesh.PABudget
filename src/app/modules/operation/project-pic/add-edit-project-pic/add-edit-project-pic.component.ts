import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { AssetAttachment, ProjectPic } from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { JDate } from '@shared/utilities/JDate/jdate';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, tap } from 'rxjs';

@Component({
  selector: 'PABudget-add-edit-project-pic',
  templateUrl: './add-edit-project-pic.component.html',
  styleUrls: ['./add-edit-project-pic.component.scss'],
})
export class AddEditProjectPicComponent {
  public datePipe = new DatePipe('en-US');
  addEditForm!: FormGroup;

  inputData = new ProjectPic();
  budgetPeriodList: any = [];
  periodDetailList: any = [];
  OperationPeriodList: any = [];
  unitList: any = [];
  sourceTypeList: any = [];
  attachmentFileTypeTemplateId = 0;
  attachmentFileName!: string;
  isLoadingSubmit = false;
  addEditFormSubmitted = false;
  @Input() mode = '';
  @Input() set data(data: ProjectPic) {
    this.inputData = data;
  }
  @Input() multiMediaId = this.attachmentFileTypeTemplateId;
  @Output() isSuccess = new EventEmitter<boolean>();
  @Output() isCloseModal = new EventEmitter<boolean>();
  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private jDateCalculatorService: JDateCalculatorService
  ) {}

  ngOnInit(): void {
    this.addEditForm = new FormGroup({
      projectId: new FormControl(null),
      title: new FormControl(null),
      code: new FormControl(null),
      picDate: new FormControl(null),
      description: new FormControl(null),
      picId: new FormControl(null),
      picTitle: new FormControl(null),
    });

    this.route.params.subscribe(params => {
      const RouteId = params['id'];
      this.addEditForm.patchValue({ projectId: parseInt(RouteId) });
    });

    if (this.mode === 'edit') {
      this.getProjectPicLst(this.inputData.id);
      this.addEditForm.patchValue(this.inputData);
    }
  }

  getProjectPicLst(id: number) {
    this.httpService
      .get(ProjectPic.apiAddress + 'Get' + `/${id}`)
      .subscribe((response: any) => {
        if (response.data) {
          this.inputData = response.data?.result;
        }
        this.addEditForm.patchValue(this.inputData);
        this.addEditForm.patchValue({
          picDate: new JDate(new Date(this.inputData.picDate)),
        });
      });
  }
  addEditProjectPic() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      // const request = this.addEditForm.value;

      const request = this.addEditForm.value;
      if (this.mode === 'insert') {
        request.picId = this.attachmentFileTypeTemplateId;
        request.picTitle = this.attachmentFileName;
      }

      request.picDate = request.picDate
        ? this.datePipe.transform(
            this.jDateCalculatorService.convertToGeorgian(
              request.picDate?.getFullYear(),
              request.picDate?.getMonth(),
              request.picDate?.getDate()
            ),
            'yyyy-MM-ddTHH:mm:ss'
          )
        : null;

      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      const url = ProjectPic.apiAddress + 'Create';

      this.isLoadingSubmit = true;

      this.httpService
        .post<ProjectPic>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'Pic',
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

  closeModal() {
    this.isCloseModal.emit(false);
  }

  uploadAttachment(files: FileList, form: any) {
    const fileName = files[0]?.name;
    if (files.length) {
      Array.from(files).forEach(file => {
        const data = new FormData();
        data.append('File', file);

        if (file.size <= 25000000)
          return this.httpService
            .post<any>(AssetAttachment.apiAddress, data)
            .subscribe(response => {
              if (response.successed && response.data && response.data.result) {
                this.messageService.add({
                  key: 'uploadFile',
                  life: 8000,
                  severity: 'success',
                  summary: 'فایل با موفقیت بارگذاری شد',
                });
                this.attachmentFileTypeTemplateId =
                  response.data.result.multiMediaId;
                this.attachmentFileName = response.data.result.fileName;
              }
            });
        else return of();
      });
    }
    // }
    form.clear();
  }
}
