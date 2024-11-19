import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import {
  FinancialRatio,
  Period,
  ProjectStructure,
} from '@shared/models/response.model';
import { id } from '@swimlane/ngx-charts';
import { ConfirmationService, MessageService } from 'primeng/api';
import { title } from 'process';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-project-structure',
  templateUrl: './project-structure.component.html',
  styleUrls: ['./project-structure.component.scss'],
  providers: [ConfirmationService],
})
export class ProjectStructureComponent {
  ProjectStructures: ProjectStructure[] = [];
  typeList: any = [];
  selectedProjectStructures: any;
  rowValue: any;
  isOpenAddProjectStructure = false;
  addNewProjectStructureForm!: FormGroup;
  addNewProjectStructureLoading = false;
  addNewProjectStructureSubmitted = false;
  RouteId: any;
  isLoadingSubmit = false;
  periodLst: Period[] = [];
  periodFromDetailLst: Period[] = [];
  periodToDetailLst: Period[] = [];
  modalTitle = '';
  mode!:
    | 'insertProjectStr'
    | 'insertSubProjectStr'
    | 'editProjectStr'
    | 'editSubProjectStr';

  get id() {
    return this.addNewProjectStructureForm.get('id');
  }
  get ProjectStructureTitle() {
    return this.addNewProjectStructureForm.get('ProjectStructureTitle');
  }
  get ProjectStructureCode() {
    return this.addNewProjectStructureForm.get('ProjectStructureCode');
  }

  get hasChild() {
    return this.addNewProjectStructureForm.get('hasChild')?.value;
  }
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTypeCodeList();
    this.getPeriodLst();
    this.addNewProjectStructureForm = new FormGroup({
      id: new FormControl(),
      projectId: new FormControl(),
      title: new FormControl(),
      parentId: new FormControl(),
      hasChild: new FormControl(),
      from_PeriodId: new FormControl(),
      to_PeriodId: new FormControl(),
      from_PeriodDetailId: new FormControl(),
      to_PeriodDetailId: new FormControl(),
      typeCode: new FormControl(),
      hourPerson: new FormControl(),
    });
    this.route.params.subscribe(params => {
      this.RouteId = params['id'];
    });
    this.getProjectStructureList();
  }

  /*--------------------------
  # GET
  --------------------------*/
  getProjectStructureList() {
    this.httpService
      .get<ProjectStructure[]>(ProjectStructure.apiAddress + `${this.RouteId}`)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            this.selectedProjectStructures = new ProjectStructure();
            this.ProjectStructures = [];
            return response.data.result;
          } else return [new ProjectStructure()];
        })
      )
      .subscribe(response => {
        this.ProjectStructures = response;
      });
  }

  onNodeSelect(e: any) {
    console.log('node select');
  }

  onChangeFromPeriod(e: any) {
    this.getFromPeriodDetailLst(e.value);
  }

  onChangeToPeriod(e: any) {
    this.getToPeriodDetailLst(e.value);
  }

  getTypeCodeList() {
    this.httpService
      .get<ProjectStructure[]>(ProjectStructure.apiAddressType)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.typeList = response.data.result;
        }
      });
  }
  getPeriodLst() {
    this.httpService
      .get<Period[]>(Period.apiAddress + 'ListDropDown')
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodLst = response.data.result;
        }
      });
  }

  getFromPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodFromDetailLst = response.data.result;
        }
      });
  }
  getToPeriodDetailLst(periodId: number) {
    this.httpService
      .get<Period[]>(Period.apiAddressDetail + 'ListDropDown/' + periodId)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.periodToDetailLst = response.data.result;
        }
      });
  }

  onAddNewProjectStructure(): void {
    this.addNewProjectStructureForm.reset();
    this.addNewProjectStructureSubmitted = false;
    this.isOpenAddProjectStructure = true;
    this.modalTitle = 'تعریف ساختار پروژه';
    this.mode = 'insertProjectStr';
    this.addNewProjectStructureForm.controls['hasChild'].setValue(true);
  }

  onAddSubGroup() {
    setTimeout(() => {
      this.addNewProjectStructureForm.reset();
      this.addNewProjectStructureSubmitted = false;
      this.isOpenAddProjectStructure = true;
      this.modalTitle = 'تعریف زیرگروه ساختار پروژه';
      this.mode = 'insertSubProjectStr';
      this.addNewProjectStructureForm.controls['hasChild'].setValue(true);
    }, 100);
  }

  onSubmitNewProjectStructure() {
    this.addNewProjectStructureSubmitted = true;
    if (this.addNewProjectStructureForm.invalid) return;
    let url = '';
    const request: ProjectStructure = this.addNewProjectStructureForm.value;
    request.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.mode == 'editProjectStr') {
      url = ProjectStructure.apiAddress + 'Create';
      request.parentId = this.selectedProjectStructures.parentId;
      request.id = this.selectedProjectStructures.id;
    } else if (this.mode == 'editSubProjectStr') {
      url = ProjectStructure.apiAddress + 'Create';
      request.parentId = this.selectedProjectStructures.parentId;
      request.id = this.selectedProjectStructures.id;
    } else if (this.mode == 'insertSubProjectStr') {
      url = ProjectStructure.apiAddress + 'Create';
      request.id = 0;
      request.parentId = this.selectedProjectStructures.id;
    } else if (this.mode == 'insertProjectStr') {
      url = ProjectStructure.apiAddress + 'Create';
      request.parentId = null;
    }

    this.httpService
      .post<ProjectStructure>(url, request)
      .pipe(tap(() => (this.addNewProjectStructureLoading = false)))
      .subscribe(response => {
        if (response.successed) {
          this.getProjectStructureList();
          this.messageService.add({
            key: 'ProjectStructureMessage',
            life: 8000,
            severity: 'success',
            detail: `اطلاعات  ساختار پروژه`,
            summary: 'با موفقیت اضافه شد',
          });
          this.isOpenAddProjectStructure = false;
        }
      });
  }

  onEditRow() {
    setTimeout(() => {
      this.addNewProjectStructureForm.reset();
      this.isOpenAddProjectStructure = true;
      this.modalTitle = 'ویرایش ساختار پروژه';
      if (this.selectedProjectStructures.children !== null)
        this.mode = 'editProjectStr';
      else this.mode = 'editSubProjectStr';
      const ProjectTreeId = this.selectedProjectStructures.id;
      this.getRowValue(ProjectTreeId);
    }, 100);
  }

  getRowValue(id: number) {
    this.httpService
      .get<ProjectStructure[]>(ProjectStructure.apiAddress + 'Get/' + id)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.rowValue = response.data.result;
        }
        // this.addNewProjectStructureForm.patchValue({
        //   title: this.rowValue.title,
        //   from_PeriodId: this.rowValue.from_PeriodId,
        //   to_PeriodId: this.rowValue.to_PeriodId,
        //   from_PeriodDetailId: this.rowValue.from_PeriodDetailId,
        //   to_PeriodDetailId: this.rowValue.to_PeriodDetailId,
        //   typeCode: this.rowValue.typeCode,
        //   hourPerson: this.rowValue.hourPerson,
        //   hasChild: this.rowValue.hasChild,
        // });

        this.addNewProjectStructureForm.patchValue(this.rowValue);
      });
  }

  onDeleteRow() {
    setTimeout(() => {
      this.confirmationService.confirm({
        message: 'آیا از حذف ساختار پروژه اطمینان دارید؟',
        header: `عنوان ${this.selectedProjectStructures.ProjectStructureTitle}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () =>
          this.deleteGroupProduct(
            this.selectedProjectStructures.id,
            this.selectedProjectStructures.title
          ),
      });
    }, 100);
  }

  deleteGroupProduct(id: number, title: string) {
    this.httpService
      .get<ProjectStructure>(ProjectStructure.apiAddress + 'Delete' + `/${id}`)
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'ProjectStructureMessage',
            life: 8000,
            severity: 'success',
            detail: `شرکت ${title}`,
            summary: 'با موفقیت حذف شد',
          });
          this.getProjectStructureList();
        }
      });
  }
}
