import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '@core/http/http.service';
import { Subject, UrlBuilder } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';

@Component({
  selector: 'app-subject-definition',
  templateUrl: './subject-definition.component.html',
  styleUrls: ['./subject-definition.component.scss'],
  providers: [ConfirmationService],
})
export class SubjectDefinitionComponent implements OnInit {
  /** Table data total count. */
  totalCount!: number;

  /** Main table data. */
  subjects: Subject[] = [];

  /** Main table loading. */
  loading = false;

  /*--------------------------
  # CRUD
  --------------------------*/
  addNewSubjectForm!: FormGroup;

  addNewSubjectModel = new Subject();

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  get title() {
    return this.addNewSubjectForm.get('title');
  }
  get enName() {
    return this.addNewSubjectForm.get('enName');
  }

  addNewSubjectLoading = false;

  addNewSubjectFormSubmitted = false;

  selectedSubject = new Subject();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getSubjects();
    this.addNewSubjectForm = new FormGroup({
      title: new FormControl(
        this.addNewSubjectModel.title,
        Validators.required
      ),
      enName: new FormControl(
        this.addNewSubjectModel.enName,
        Validators.required
      ),
    });
  }

  /*--------------------------
  # Data
  --------------------------*/
  /** Get subjects from server. */
  getSubjects() {
    this.loading = true;

    this.httpService
      .get<Subject[]>(UrlBuilder.build(Subject.apiAddress, 'LIST'))
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new Subject()];
        })
      )
      .subscribe(subjects => (this.subjects = subjects));
  }

  addOrUpdateSubject() {
    this.addNewSubjectFormSubmitted = true;

    if (this.addNewSubjectForm.valid) {
      this.addNewSubjectLoading = true;

      const { enName, title } = this.addNewSubjectForm.value;

      const request = new Subject();
      request.id = this.selectedSubject.id || 0;
      request.title = title;
      request.enName = enName;

      this.httpService
        .post<Subject>(UrlBuilder.build(Subject.apiAddress, 'CREATE'), request)
        .pipe(
          tap(() => {
            this.addNewSubjectLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getSubjects();

            this.messageService.add({
              key: 'subjectDefinition',
              life: 8000,
              severity: 'success',
              detail: `عنوان`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewSubjectForm();
          }
        });
    }
  }

  editRow(subject: Subject) {
    if (subject.id) {
      this.selectedSubject = subject;
      this.addNewSubjectForm.patchValue(subject);
    }
  }

  deleteRow(subject: Subject) {
    if (subject && subject.id)
      this.confirmationService.confirm({
        message: 'آیا از حذف عنوان اطمینان دارید؟',
        header: `عنوان ${subject.title}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteSubject(subject.id, subject.title),
      });
  }

  deleteSubject(id: number, title: string) {
    if (id && title) {
      this.httpService
        .get<Subject>(
          UrlBuilder.build(Subject.apiAddress, 'DELETE') + `/${id}`
        )
        .subscribe(response => {
          if (response.successed) {
            this.getSubjects();

            this.messageService.add({
              key: 'subjectDefinition',
              life: 8000,
              severity: 'success',
              detail: `عنوان ${title}`,
              summary: 'با موفقیت حذف شد',
            });

            this.resetAddNewSubjectForm();
          }
        });
    }
  }

  resetAddNewSubjectForm() {
    this.addNewSubjectFormSubmitted = false;
    this.addNewSubjectForm.reset();
    this.selectedSubject = new Subject();
  }
}
