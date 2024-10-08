import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShareHolder, Company, Period } from '@shared/models/response.model';
import { HttpService } from '@core/http/http.service';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'PABudget-add-edit-share-holder-company',
  templateUrl: './add-edit-share-holder-company.component.html',
  styleUrls: ['./add-edit-share-holder-company.component.scss']
})
export class AddEditShareHolderCompanyComponent {
  // form property
  addEditForm!: FormGroup;
  addEditFormSubmitted = false;
  isLoadingSubmit = false;

  // dropdown data list
  periodList: any = [];
  shareHolderTypeList: any = [];
  companyList: any = [];
  shareHolderPartyList: any = [];
  isVisibleUserLst = false;

  // dialog property 
  selectedUserId: number = 0;

  inputData = new ShareHolder();
  @Input() mode = '';
  @Input() set data1(data: ShareHolder) {
    this.inputData = data;
  }

  @Output() isSuccess = new EventEmitter<boolean>();

  get amount() {
    return this.addEditForm.get('amount');
  }

  get percentOwner() {
    return this.addEditForm.get('percentOwner');
  }
  get periodId() {
    return this.addEditForm.get('periodId');
  }
  get companyId() {
    return this.addEditForm.get('companyId');
  }
  get shareHolderPartyId() {
    return this.addEditForm.get('shareHolderPartyId	');
  }
  get shareHolderTypeId() {
    return this.addEditForm.get('shareHolderTypeId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getPeriodList();
    this.getShareHolderTypeList();
    this.getCompanyLst();
    this.getShareHolderPartyList();

    this.addEditForm = new FormGroup({
      amount: new FormControl('', Validators.required),
      percentOwner: new FormControl('', Validators.required),
      companyId: new FormControl(0, Validators.required),
      shareHolderPartyId: new FormControl(0, Validators.required),
      periodId: new FormControl(0, Validators.required),
      shareHolderTypeId: new FormControl(0)
    });

    if (this.mode === 'edit') {
      this.getRowData(this.inputData.id);
    }

  }

  onOpenUsersList() {
    this.isVisibleUserLst = true;
  }

  addEditBudget() {
    this.addEditFormSubmitted = true;
    if (this.addEditForm.valid) {
      const request = this.addEditForm.value;
      request.id = this.mode === 'insert' ? 0 : this.inputData.id;
      request.shareHolderPartyId = this.selectedUserId;
      const url = ShareHolder.apiAddress + 'Createshareholders';

      this.isLoadingSubmit = true;
      this.httpService
        .post<ShareHolder>(url, request)
        .pipe(tap(() => (this.isLoadingSubmit = false)))
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'shareholders',
              life: 8000,
              severity: 'success',
              detail: ` عنوان  ${request.amount}`,
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

  getPeriodList() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodList = response.data.result;
        }
      });
  }

  getCompanyLst() {
    this.httpService
      .get<Company[]>(Company.apiAddressUserCompany + 'Combo')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.companyList = response.data.result;
        }
      });
  }

  getShareHolderPartyList() {
    this.httpService
      .post<ShareHolder[]>(ShareHolder.PartyListApiAddress, {
        withOutPagination: true
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.shareHolderPartyList = response.data.result;
        }
      });
  }

  getShareHolderTypeList() {
    this.httpService
      .get<ShareHolder[]>(ShareHolder.TypeListApiAddress + 'List')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.shareHolderTypeList = response.data.result;
        }
      });
  }

  getRowData(id: number) {
    this.httpService
      .get<any>(ShareHolder.apiAddress + 'GetShareHolderById/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.inputData = response.data.result;
          this.addEditForm.patchValue(response.data.result);
        }
      });
  }

  onHide(event: ShareHolder) {
    this.isVisibleUserLst = false;
    this.addEditForm.patchValue({
      shareHolderPartyId: event.partyName ? event.partyName : '' + ' ' +
        event.partyLastName ? event.partyLastName : ''
    })
    this.selectedUserId = event.id;
  }

}
