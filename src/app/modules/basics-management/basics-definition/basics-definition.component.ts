

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  CreateBasics,
  Basics,
  UrlBuilder,
  Subject,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-basics-definition',
  templateUrl: './basics-definition.component.html',
  styleUrls: ['./basics-definition.component.scss']
})
export class BasicsDefinitionComponent implements OnInit {
  /* Table  */
  totalCount!: number;
  basicsList: Basics[] = [];
  loading = false;

  /*  CRUD  */
  addNewBasicsForm!: FormGroup;
  addNewBasicsModel = new Basics();
  gridClass = 'p-datatable-sm';
  dataTableRows = 10;
  first = 0;
  modalTitle = 'افزودن اطلاعات پایه جدید';
  isOpenAddEditBasicDefinition = false;
  subjects: Subject[] = [];


  get code() {
    return this.addNewBasicsForm.get('code');
  }
  get title() {
    return this.addNewBasicsForm.get('title');
  }

  addNewBasicsLoading = false;

  addNewBasicsFormSubmitted = false;


  constructor(
    private httpService: HttpService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    // this.getBasicsList();
    this.addNewBasicsForm = new FormGroup({
      selectedSubject: new FormControl('', Validators.required),
      code: new FormControl(this.addNewBasicsModel.code, Validators.required),
      title: new FormControl(this.addNewBasicsModel.title, Validators.required),
    });

    this.getSubjects();
  }

  /*--------------------------
  # GET
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
      .subscribe(subjects => {
        this.subjects = subjects;
        if (subjects.length) {
          this.addNewBasicsForm.patchValue({
            selectedSubject: subjects[0],
          });
          this.getBasicsList(this.addNewBasicsForm.get('selectedSubject'));
        }
      });
  }

  addNewItem() {
    this.isOpenAddEditBasicDefinition = true;
    this.addNewBasicsForm.controls['title'].reset();
    this.addNewBasicsForm.controls['code'].reset();
  }


  /** Get basics from server. */
  getBasicsList(data?: any) {
    if (data) {
      this.loading = true;
      this.first = 0;
      this.httpService
        .get<Basics[]>(
          UrlBuilder.build(Basics.apiAddress + `/${data.value.id}`, 'DETAIL')
        )
        .pipe(
          tap(() => (this.loading = false)),
          map(response => {
            if (response.data && response.data.result)
              return response.data.result;
            else return [new Basics()];
          })
        )
        .subscribe(basicsList => (this.basicsList = basicsList));
    }
  }

  /*--------------------------
  # CREATE
  --------------------------*/
  /** Add new basics */
  addNewBasics() {
    this.addNewBasicsFormSubmitted = true;

    if (this.addNewBasicsForm.valid) {
      this.addNewBasicsLoading = true;

      const { code, title } = this.addNewBasicsForm.value;

      const request = new Basics();
      request.masterId = this.addNewBasicsForm.get('selectedSubject')?.value.id;
      request.code = PersianNumberService.toEnglish(code);
      request.title = title;

      this.httpService
        .post<CreateBasics>(CreateBasics.apiAddress, request)
        .pipe(
          tap(() => {
            this.addNewBasicsLoading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.getBasicsList(this.addNewBasicsForm.get('selectedSubject'));

            this.messageService.add({
              key: 'basicsDefinition',
              life: 8000,
              severity: 'success',
              detail: `اطلاعات`,
              summary: 'با موفقیت درج شد',
            });

            this.resetAddNewBasicsForm();
            this.isOpenAddEditBasicDefinition = false;
          }
        });
    }
  }

  /** Reset add new basics form. */
  resetAddNewBasicsForm() {
    this.addNewBasicsFormSubmitted = false;
    // this.addNewBasicsForm.reset();
    this.addNewBasicsForm.controls['code'].reset();
    this.addNewBasicsForm.controls['title'].reset();
  }
}
