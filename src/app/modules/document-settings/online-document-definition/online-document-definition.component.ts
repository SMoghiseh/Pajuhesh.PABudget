import { Component, OnInit } from '@angular/core';
import { SidemenuService } from '@core/layout/sidemenu/sidemenu.service';
import { HttpService } from '@core/http/http.service';
import {
  DocumentType,
  DocumentTypeFileNeeds,
  UrlBuilder,
  CreateOnlineDocDefinition,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-online-document-definition',
  templateUrl: './online-document-definition.component.html',
  styleUrls: ['./online-document-definition.component.scss'],
  providers: [],
})
export class OnlineDocumentDefinitionComponent implements OnInit {
  public datePipe = new DatePipe('en-US');
  onlineDocumentDefinitionForm!: FormGroup;
  nodes: any;
  needs: any;
  first = 0;

  documentTypes: DocumentType[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  onlineDocumentDefinitionFormLoading = false;

  // clonedNeeds: DocumentTypeFileNeeds = this.needs;

  onlineDocumentDefinitionFormSubmitted = false;

  createOnlineDocumentDefinitionModel = new CreateOnlineDocDefinition();

  onlineDocumentsLst: Array<CreateOnlineDocDefinition> = [];

  get documentTypeId() {
    return this.onlineDocumentDefinitionForm.get('documentTypeId');
  }

  get activeDate() {
    return this.onlineDocumentDefinitionForm.get('activeDate');
  }

  get expiredDate() {
    return this.onlineDocumentDefinitionForm.get('expiredDate');
  }

  get description() {
    return this.onlineDocumentDefinitionForm.get('description');
  }

  get increaseValueScore() {
    return this.onlineDocumentDefinitionForm.get('increaseValueScore');
  }

  get decreaseValueScore() {
    return this.onlineDocumentDefinitionForm.get('decreaseValueScore');
  }
  get isActive() {
    return this.onlineDocumentDefinitionForm.get('isActive');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    public sidemenuService: SidemenuService,
    private jDateCalculatorService: JDateCalculatorService
  ) { }

  ngOnInit(): void {
    this.offcanvasModeDetection(window.innerWidth);
    this.getdocumentTypeTree();
    this.getOnlineDocumentDefinition();
    this.onlineDocumentDefinitionForm = new FormGroup({
      documentTypeId: new FormControl(
        this.createOnlineDocumentDefinitionModel.docTypeId,
        Validators.required
      ),
      activeDate: new FormControl(
        this.createOnlineDocumentDefinitionModel.activeDate,
        Validators.required
      ),
      expiredDate: new FormControl(
        this.createOnlineDocumentDefinitionModel.expiredDate,
        Validators.required
      ),
      description: new FormControl(
        this.createOnlineDocumentDefinitionModel.description,
        Validators.required
      ),
      increaseValueScore: new FormControl(
        this.createOnlineDocumentDefinitionModel.increaseValueScore,
        Validators.required
      ),
      decreaseValueScore: new FormControl(
        this.createOnlineDocumentDefinitionModel.decreaseValueScore,
        Validators.required
      ),
      isActive: new FormControl(true, Validators.required),
    });
  }

  getdocumentTypeTree() {
    this.loading = true;

    this.httpService
      .get<DocumentType[]>(
        UrlBuilder.build(DocumentType.apiAddress, 'TREE')
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new DocumentType()];
        })
      )
      .subscribe(documentTypes => (this.nodes = documentTypes));
  }
  onNodeSelect() {
    const tmp = this.onlineDocumentDefinitionForm.get(
      'documentTypeId'
    )?.value;
    this.getdocumentTypeFileNeeds(tmp?.key);
    this.getOnlineDocumentDefinition(tmp?.key);
  }

  onClear(e: any) {
    this.getOnlineDocumentDefinition();
  }

  getdocumentTypeFileNeeds(GID: number) {
    this.first = 0;
    this.httpService
      .get<DocumentTypeFileNeeds[]>(
        DocumentTypeFileNeeds.apiAddress + `/List/${GID}`
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return; //[new DocumentTypeFileNeeds()];
        })
      )
      .subscribe(documentTypeFileNeeds => {
        this.needs = documentTypeFileNeeds;
      });
  }
  private offcanvasModeDetection(innerWidth: number) {
    if (innerWidth < 991) this.sidemenuService.offcanvasMode = true;
    else this.sidemenuService.offcanvasMode = false;
  }

  createOnlineDocumentDefinition() {
    this.onlineDocumentDefinitionFormSubmitted = true;
    if (this.onlineDocumentDefinitionForm.valid) {
      this.onlineDocumentDefinitionFormLoading = true;
      this.loading = true;
      const {
        documentTypeId,
        activeDate,
        expiredDate,
        description,
        increaseValueScore,
        decreaseValueScore,
        isActive,
      } = this.onlineDocumentDefinitionForm.value;
      activeDate;
      const request = new CreateOnlineDocDefinition();
      request.description = description;
      request.activeDate = activeDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            activeDate?.getFullYear(),
            activeDate?.getMonth(),
            activeDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.expiredDate = expiredDate
        ? this.datePipe.transform(
          this.jDateCalculatorService.convertToGeorgian(
            expiredDate?.getFullYear(),
            expiredDate?.getMonth(),
            expiredDate?.getDate()
          ),
          'yyyy-MM-ddTHH:mm:ss'
        )
        : null;
      request.increaseValueScore = increaseValueScore;
      request.decreaseValueScore = decreaseValueScore;
      request.isActive = isActive;
      request.docTypeId = documentTypeId?.key;

      this.httpService
        .post<CreateOnlineDocDefinition>(
          UrlBuilder.build(CreateOnlineDocDefinition.apiAddress, 'CREATE'),
          request
        )
        .pipe(
          tap(() => {
            this.onlineDocumentDefinitionFormLoading = false;
            this.loading = false;
          })
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'onlineDocumentDefinition',
              life: 8000,
              severity: 'success',
              detail: `اسناد برخط`,
              summary: 'با موفقیت درج شد',
            });
            this.onlineDocumentDefinitionFormSubmitted = false;
            this.onlineDocumentDefinitionForm.patchValue({
              activeDate: null,
              expiredDate: null,
              description: '',
              increaseValueScore: null,
              decreaseValueScore: null,
            });
            this.getOnlineDocumentDefinition(documentTypeId?.key);
          }
        });
    }
  }

  getOnlineDocumentDefinition(documentTypeId = null) {
    this.loading = true;
    const body = {
      withOutPagination: true,
      documentTypeId: documentTypeId,
    };
    this.httpService
      .post<CreateOnlineDocDefinition[]>(
        CreateOnlineDocDefinition.apiAddress + '/listFilter',
        body
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new CreateOnlineDocDefinition()];
        })
      )
      .subscribe(
        onlineDocumentsLst => (this.onlineDocumentsLst = onlineDocumentsLst)
      );
  }
}
