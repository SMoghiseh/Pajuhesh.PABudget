import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { ProjectStructure } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-project-structure',
  templateUrl: './project-structure.component.html',
  styleUrls: ['./project-structure.component.scss'],
  providers: [ConfirmationService],
})
export class ProjectStructureComponent {
  ProjectStructures: ProjectStructure[] = [];
  companyList: any = [];
  selectedProjectStructures: any;
  isOpenAddProjectStructure = false;
  addNewProjectStructureForm!: FormGroup;
  addNewProjectStructureLoading = false;
  addNewProjectStructureSubmitted = false;
  RouteId: any;
  modalTitle = '';
  mode!:
    | 'insertGroupPro'
    | 'insertSubGroupPro'
    | 'editGroupPro'
    | 'editSubGroupPro';

  get ProjectStructureTitle() {
    return this.addNewProjectStructureForm.get('ProjectStructureTitle');
  }
  get ProjectStructureCode() {
    return this.addNewProjectStructureForm.get('ProjectStructureCode');
  }
  get companyId() {
    return this.addNewProjectStructureForm.get('companyId');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {   debugger
    this.addNewProjectStructureForm = new FormGroup({
      ProjectStructureTitle: new FormControl('', Validators.required),
      ProjectStructureCode: new FormControl(0, Validators.required),
      companyId: new FormControl(0, Validators.required),
    });
    this.route.params.subscribe(params => { debugger
      this.RouteId = params['id'];
    });
    this.getProjectStructureList();
  }

  /*--------------------------
  # GET
  --------------------------*/
  getProjectStructureList() {
    debugger;
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
      .subscribe(ProjectStructures => {
        this.ProjectStructures = ProjectStructures;
      });
  }

  onNodeSelect(e: any) {
    console.log('node select');
  }

  onAddNewProjectStructure(): void {
    this.addNewProjectStructureForm.reset();
    this.addNewProjectStructureSubmitted = false;
    this.isOpenAddProjectStructure = true;
    this.modalTitle = 'تعریف گروه محصول';
    this.mode = 'insertGroupPro';
  }

  onAddSubGroup() {
    setTimeout(() => {
      this.addNewProjectStructureForm.reset();
      this.addNewProjectStructureSubmitted = false;
      this.isOpenAddProjectStructure = true;
      this.modalTitle = 'تعریف زیرگروه محصول';
      this.mode = 'insertSubGroupPro';
    }, 100);
  }

  onSubmitNewProjectStructure() {
    this.addNewProjectStructureSubmitted = true;
    if (this.addNewProjectStructureForm.invalid) return;
    let url = '';
    const request: ProjectStructure = this.addNewProjectStructureForm.value;

    if (this.mode == 'editGroupPro') {
      url = ProjectStructure.apiAddress;
      request.parentId = this.selectedProjectStructures.parentId;
      request.id = this.selectedProjectStructures.id;
    } else if (this.mode == 'editSubGroupPro') {
      url = ProjectStructure.apiAddress;
      request.parentId = this.selectedProjectStructures.parentId;
      request.id = this.selectedProjectStructures.id;
    } else if (this.mode == 'insertSubGroupPro') {
      url = ProjectStructure.apiAddress;
      request.parentId = this.selectedProjectStructures.id;
    } else if (this.mode == 'insertGroupPro') {
      url = ProjectStructure.apiAddress;
      request.parentId = null;
    }

    // request.ProjectStructureCode = Number(request.ProjectStructureCode);

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
            detail: `اطلاعات زیرگروه محصول`,
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
      this.modalTitle = 'ویرایش گروه محصول';
      if (!this.selectedProjectStructures.parentId) this.mode = 'editGroupPro';
      else this.mode = 'editSubGroupPro';
      this.addNewProjectStructureForm.patchValue({
        ProjectStructureTitle:
          this.selectedProjectStructures.ProjectStructureTitle,
        ProjectStructureCode:
          this.selectedProjectStructures.ProjectStructureCode,
      });
    }, 100);
  }

  onDeleteRow() {
    setTimeout(() => {
      this.confirmationService.confirm({
        message: 'آیا از حذف گروه کالا اطمینان دارید؟',
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
            this.selectedProjectStructures.ProjectStructureTitle
          ),
      });
    }, 100);
  }

  deleteGroupProduct(id: number, ProjectStructureTitle: string) {
    this.httpService
      .get<ProjectStructure>(ProjectStructure.apiAddress + `/${id}`)
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'ProjectStructureMessage',
            life: 8000,
            severity: 'success',
            detail: `شرکت ${ProjectStructureTitle}`,
            summary: 'با موفقیت حذف شد',
          });
          this.getProjectStructureList();
        }
      });
  }
}
