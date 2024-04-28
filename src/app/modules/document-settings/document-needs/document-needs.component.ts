import { Component, OnInit } from '@angular/core';
import { SidemenuService } from '@core/layout/sidemenu/sidemenu.service';
import { HttpService } from '@core/http/http.service';
import {
  DocumentType,
  DocumentTypeFileNeeds,
  UrlBuilder,
} from '@shared/models/response.model';
import { MessageService } from 'primeng/api';

import { map, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'marketwatch-document-needs',
  templateUrl: './document-needs.component.html',
  styleUrls: ['./document-needs.component.scss'],
  providers: [],
})
export class DocumentNeedsComponent implements OnInit {
  needsFilterForm!: FormGroup;
  nodes: any;
  needs: any;
  selectedNeeds: any[] = [];
  first = 0;

  documentTypes: DocumentType[] = [];

  /** Main table loading. */
  loading = false;

  gridClass = 'p-datatable-sm';

  dataTableRows = 10;

  onSubmitLoading = false;

  HasAddedLst = [
    {
      title: 'انتخاب شده ها',
      id: true,
    },
    {
      title: 'انتخاب نشده ها',
      id: false,
    },
    {
      title: 'همه موارد',
      id: null,
    },
  ];

  get selectedNodes() {
    return this.needsFilterForm.get('selectedNodes')?.value;
  }

  get NeedTitle() {
    return this.needsFilterForm.get('NeedTitle')?.value;
  }

  get HasAdded() {
    return this.needsFilterForm.get('HasAdded')?.value;
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    public sidemenuService: SidemenuService
  ) { }

  ngOnInit(): void {
    this.offcanvasModeDetection(window.innerWidth);
    this.getDocumentTypeTree();

    this.needsFilterForm = new FormGroup({
      selectedNodes: new FormControl(),
      NeedTitle: new FormControl(),
      HasAdded: new FormControl(),
    });
  }

  getDocumentTypeTree() {
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
    this.getDocumentTypeFileNeeds(this.selectedNodes?.key);
  }

  getDocumentTypeFileNeeds(GID: number) {
    this.loading = true;
    this.first = 0;
    const body = {
      documentTypeId: GID,
      NeedTitle: this.NeedTitle,
      HasAdded: this.HasAdded,
    };
    this.httpService
      .post<DocumentTypeFileNeeds[]>(
        DocumentTypeFileNeeds.apiAddress + `/ListCheck`,
        body
      )
      .pipe(
        tap(() => (this.loading = false)),
        map(response => {
          if (response.data && response.data) return response.data;
          else return [];
        })
      )
      .subscribe(documentTypeFileNeeds => {
        this.needs = documentTypeFileNeeds;
        this.selectedNeeds = this.needs.filter((need: any) => need.isAdded);
      });
  }
  private offcanvasModeDetection(innerWidth: number) {
    if (innerWidth < 991) this.sidemenuService.offcanvasMode = true;
    else this.sidemenuService.offcanvasMode = false;
  }

  onSubmit() {
    this.onSubmitLoading = true;
    const selectedRow: any = [];
    this.selectedNeeds.map(item => {
      selectedRow.push({
        attachmentFileTypeId: item.id,
        isRequired: item.isRequired,
      });
    });
    this.getAddDocumentTypeFileNeeds(selectedRow);
  }

  getAddDocumentTypeFileNeeds(selectedRow: any) {
    this.loading = true;
    const request = {
      documentTypeId: this.selectedNodes?.key,
      attachmentFileTypes: selectedRow,
    };
    this.httpService
      .post<DocumentTypeFileNeeds>(
        UrlBuilder.build(DocumentTypeFileNeeds.apiAddress, 'ADD'),
        request
      )
      .pipe(
        tap(() => {
          this.onSubmitLoading = false;
          this.loading = false;
        })
      )
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'documentNeeds',
            life: 8000,
            severity: 'success',
            detail: `نیازمندی اسناد`,
            summary: 'با موفقیت درج شد',
          });
        }
      });
  }
}
