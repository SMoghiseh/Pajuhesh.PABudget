import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/http/http.service';
import { Report, UrlBuilder, TagType } from '@shared/models/response.model';
import { JDateCalculatorService } from '@shared/utilities/JDate/calculator/jdate-calculator.service';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { JDate } from '@shared/utilities/JDate/jdate';
@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss'],
})
export class EditTagsComponent implements OnInit {
  tagsList: TagType[] = [];

  /*--------------------------
  # Form
  --------------------------*/
  editTagsForm!: FormGroup;
  addNewFormModel = new Report();
  addNewFormSubmitted = false;
  selectedAdvertId: any;

  @Input()
  set rowData(data: Report) {
    this.selectedAdvertId = data.docId;
    this.getAdvertTypeTagsList(data.id);
  }

  @Output() closeModal = new EventEmitter<any>();

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private jDateCalculatorService: JDateCalculatorService
  ) { }

  ngOnInit(): void {
    this.editTagsForm = new FormGroup({});
  }

  /*--------------------------
  # Form
  --------------------------*/
  addNewReport() {
    this.addNewFormSubmitted = true;

    if (this.editTagsForm.valid) {
      const request = new Report();

      const tags: any[] = [];
      this.tagsList.forEach(element => {
        let val;
        if (element.typeName === 'Date') {
          val = this.jDateCalculatorService.convertToGeorgian(
            this.editTagsForm
              .get(
                element.tagName +
                '_' +
                element.typeName +
                '_' +
                element.docTypeTagsId
              )
              ?.value?.getFullYear(),
            this.editTagsForm
              .get(
                element.tagName +
                '_' +
                element.typeName +
                '_' +
                element.docTypeTagsId
              )
              ?.value?.getMonth(),
            this.editTagsForm
              .get(
                element.tagName +
                '_' +
                element.typeName +
                '_' +
                element.docTypeTagsId
              )
              ?.value?.getDate()
          );
        } else
          val = this.editTagsForm
            .get(
              element.tagName +
              '_' +
              element.typeName +
              '_' +
              element.docTypeTagsId
            )
            ?.value.toString();
        tags.push({
          id: element.id,
          docTypeId: element.docTypeId,
          docTypeTagsId: element.docTypeTagsId,
          typeName: element.typeName,
          tagName: element.tagName,
          displayName: element.displayName,
          tagValue: val,
          isRequired: element.isRequired,
        });
      });
      request.docId = this.selectedAdvertId;
      request.tags = tags;
      this.httpService
        .post<Report[]>(
          UrlBuilder.build(TagType.apiAddressTags + '/EditAdvertTags', ''),
          request
        )
        .subscribe(response => {
          if (response.successed) {
            this.messageService.add({
              key: 'notificationDefinition',
              life: 8000,
              severity: 'success',
              detail: `اسناد`,
              summary: 'با موفقیت تعریف شد',
            });

            this.reseteditTagsForm();
            this.closeModal.emit();
          }
        });
    }
  }

  reseteditTagsForm() {
    this.editTagsForm.reset();
    this.addNewFormSubmitted = false;
    this.closeModal.emit();
  }

  getAdvertTypeTagsList(advertTypeId: number) {
    this.httpService
      .get<TagType[]>(
        TagType.apiAddressTags + `/AdvertTagsWithNeed/${advertTypeId}`
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result)
            return response.data.result;
          else return [new TagType()];
        })
      )
      .subscribe(documentTypes => {
        this.tagsList = documentTypes;
        documentTypes.forEach(element => {
          this.editTagsForm.addControl(
            element.tagName +
            '_' +
            element.typeName +
            '_' +
            element.docTypeTagsId,
            new FormControl(
              this.returnResData(element.typeName, element.tagValue),
              element.isRequired ? Validators.required : null
            )
          );
        });
      });
  }
  returnResData(type: string, value: string): any {
    if (type == 'String') return value;
    else if (type == 'Boolean')
      return value ? value?.toLowerCase() === 'true' : null;
    else if (type == 'Date') return value ? new JDate(new Date(value)) : null;
    else if (type == 'Decimal') return value ? parseInt(value) : null;
  }
}
