import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { KeyTypecode, Plan, Planning, SWTO, UrlBuilder } from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-matrix-swot',
  templateUrl: './matrix-swot.component.html',
  styleUrls: ['./matrix-swot.component.scss'],
})
export class MatrixSwotComponent {
  @Input() inputData: any;

  planDetailData: any;
  matrixSelected: any;
  selectDateType = 'single';
  selectedPlanName = 'ماتریس SWOT ';
  isOpenModal = false;

  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  planingList: any = [];
  typeCodeList: any = [];

  get title() {
    return this.addEditForm.get('title');
  }
  get typeCode() {
    return this.addEditForm.get('typeCode');
  }
  get swotRank() {
    return this.addEditForm.get('swotRank');
  }
  get swoPriority() {
    return this.addEditForm.get('swoPriority');
  }

  constructor(private httpService: HttpService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getPlanDetail();
    this.getPlaningList();
    this.getTypeCodeList();

    this.addEditForm = new FormGroup({
      title: new FormControl('', Validators.required),
      typeCode: new FormControl('', Validators.required),
      swotRank: new FormControl('', Validators.required),
      swoPriority: new FormControl('', Validators.required)
    });

  }

  getPlanDetail() {
    const body = {
      companyId: this.inputData.companyId,
      // periodId: yearId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressSWOT, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.planDetailData = res;
      });
  }

  addDetail(item: any) {
    this.isOpenModal = true;
    this.matrixSelected = item;
  }

  addEditPlan() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.matrixSelected.id;
      const url = SWTO.apiAddress + 'Create';

      this.isLoadingSubmit = true;
      this.httpService
        .post<SWTO>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'swot',
              life: 8000,
              severity: 'success',
              detail: ` عنوان  ${request.title}`,
              summary: 'با موفقیت درج شد'
            });
            this.getPlanDetail();
            this.isOpenModal = false;
          }
        });
    }
  }

  getPlaningList() {
    this.httpService
      .post<Planning[]>(Planning.apiAddress + 'List', { "withOutPagination": true })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.planingList = response.data.result;
        }
      });
  }

  getTypeCodeList() {
    this.httpService
      .get<KeyTypecode[]>(KeyTypecode.swotApiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeCodeList = response.data.result;
        }
      });
  }

}
