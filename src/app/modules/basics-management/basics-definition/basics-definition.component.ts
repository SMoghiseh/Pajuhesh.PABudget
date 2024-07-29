

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import {
  CreateBasics,
  Basics,
  UrlBuilder,
  Subject,
  Pagination,
} from '@shared/models/response.model';
import { PersianNumberService } from '@shared/services/persian-number.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
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
  lazyLoadEvent?: LazyLoadEvent;

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
    this.addNewBasicsForm = new FormGroup({
      masterId: new FormControl(''),
      code: new FormControl(this.addNewBasicsModel.code),
      title: new FormControl(this.addNewBasicsModel.title),
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
            masterId: subjects[0],
          });
          this.getBasicsList(this.addNewBasicsForm.get('masterId'));
        }
      });
  }

  addNewItem() {
    this.isOpenAddEditBasicDefinition = true;
    this.addNewBasicsFormSubmitted = false;
    let masterId = this.addNewBasicsForm.value.masterId;
    this.addNewBasicsForm.reset();
    this.addNewBasicsForm.patchValue({
      masterId: masterId
    })
    this.addNewBasicsForm.controls['code'].setValidators(Validators.required);
    this.addNewBasicsForm.controls['title'].setValidators(Validators.required);
    this.addNewBasicsForm.controls['masterId'].setValidators(Validators.required);

  }


  /** Get basics from server. */
  getBasicsList(event?: any) {
    if (event) this.lazyLoadEvent = event;

    const pagination = new Pagination();
    const first = this.lazyLoadEvent?.first || 0;
    const rows = this.lazyLoadEvent?.rows || this.dataTableRows;
    const formValue = this.addNewBasicsForm.value;

    pagination.pageNumber = first / rows + 1;
    pagination.pageSize = rows;

    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      withOutPagination: false,
      masterId: formValue.masterId.id,
      code: PersianNumberService.toEnglish(formValue.code),
      title: formValue.title ? formValue.title : ''
    };

    if (!formValue.masterId) return;

    this.first = 0;
    const url = Basics.apiAddress + `/${formValue.masterId.id}` + '/slave/list'
    this.httpService
      .post<Basics[]>(url, body)
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

  /*--------------------------
  # CREATE
  --------------------------*/
  /** Add new basics */
  addNewBasics() {
    this.addNewBasicsFormSubmitted = true;

    if (this.addNewBasicsForm.valid) {
      debugger
      this.addNewBasicsLoading = true;

      const { code, title } = this.addNewBasicsForm.value;

      const request = new Basics();
      request.masterId = this.addNewBasicsForm.get('masterId')?.value.id;
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

            let masterId = this.addNewBasicsForm.value.masterId;
            this.addNewBasicsForm.reset();
            this.addNewBasicsForm.patchValue({
              masterId: masterId
            })
            this.getBasicsList();

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
    let masterId = this.addNewBasicsForm.value.masterId;
    this.addNewBasicsForm.reset();
    this.addNewBasicsForm.patchValue({
      masterId: masterId
    })
  }


  clearSearch() {
    let masterId = this.addNewBasicsForm.value.masterId;
    this.addNewBasicsForm.reset();
    this.addNewBasicsForm.patchValue({
      masterId: masterId
    })
    this.getBasicsList();
  }

}
