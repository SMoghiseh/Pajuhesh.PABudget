import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { ProductGroup } from '@shared/models/response.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { map, tap } from 'rxjs';

@Component({
  selector: 'PABudget-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.scss'],
  providers: [ConfirmationService]
})
export class ProductGroupComponent {

  productGroups: ProductGroup[] = [];
  selectedProductGroups: any;
  isOpenAddProductGroup: boolean = false;
  addNewProductGroupForm!: FormGroup;
  addNewProductGroupLoading = false;
  addNewProductGroupSubmitted = false;
  modalTitle = '';
  mode = '';
  get productGroupTitle() {
    return this.addNewProductGroupForm.get('productGroupTitle');
  }
  get productGroupCode() {
    return this.addNewProductGroupForm.get('productGroupCode');
  }

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addNewProductGroupForm = new FormGroup({
      productGroupTitle: new FormControl(
        '',
        Validators.required
      ),
      productGroupCode: new FormControl(
        0,
        Validators.required
      ),
    });

    this.getProductGroupList();
  }


  /*--------------------------
  # GET
  --------------------------*/
  getProductGroupList() {
    this.httpService
      .get<ProductGroup[]>(ProductGroup.getTreeViewApiAddress,
      )
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            this.selectedProductGroups = new ProductGroup();
            this.productGroups = [];
            return response.data.result;
          } else return [new ProductGroup()];
        })
      )
      .subscribe(productGroups => {
        (this.productGroups = productGroups)
      });
  }

  onNodeSelect(e: any) {
    console.log('node select')
  }

  onAddNewProductGroup(): void {
    this.addNewProductGroupForm.reset();
    this.isOpenAddProductGroup = true;
    this.modalTitle = 'تعریف گروه محصول';
    this.mode = 'insertGroupPro'
  }



  onAddSubGroup() {
    setTimeout(() => {
      this.addNewProductGroupForm.reset();
      this.isOpenAddProductGroup = true;
      this.modalTitle = 'تعریف زیرگروه محصول';
      this.mode = 'insertSubGroupPro';
    }, 100)
  }

  onSubmitNewProductGroup() {
    this.addNewProductGroupSubmitted = true;
    if (this.addNewProductGroupForm.invalid) return;
    let url = '';
    const request = new ProductGroup();
    const value = this.addNewProductGroupForm.value;
    value.parenId = null;

    if (this.mode == 'editGroupPro') {
      url = ProductGroup.editApiAddress + '/' + this.selectedProductGroups.id
    } else if (this.mode == 'insertSubGroupPro') {
      value.parentId = this.selectedProductGroups.id;
      url = ProductGroup.createApiAddress;
    } else if (this.mode == 'insertGroupPro') {
    }

    request.parentId = value.parenId;
    request.productGroupCode = Number(value.productGroupCode);
    request.productGroupTitle = value.productGroupTitle;

    this.httpService
      .post<ProductGroup>(url, request)
      .pipe(tap(() => (this.addNewProductGroupLoading = false)))
      .subscribe(response => {
        if (response.successed) {
          this.getProductGroupList();
          this.messageService.add({
            key: 'productGroupMessage',
            life: 8000,
            severity: 'success',
            detail: `اطلاعات زیرگروه محصول`,
            summary: 'با موفقیت اضافه شد',
          });
          this.isOpenAddProductGroup = false;
        }
      });
  }

  onEditRow() {
    setTimeout(() => {
      this.addNewProductGroupForm.reset();
      this.isOpenAddProductGroup = true;
      this.modalTitle = 'ویرایش گروه محصول';
      this.mode = 'editGroupPro';
      this.addNewProductGroupForm.patchValue({
        productGroupTitle: this.selectedProductGroups.productGroupTitle,
        productGroupCode: this.selectedProductGroups.productGroupCode
      })
    }, 100)
  }

  onDeleteRow() {
    setTimeout(() => {
      this.confirmationService.confirm({
        message: 'آیا از حذف گروه کالا اطمینان دارید؟',
        header: `عنوان ${this.selectedProductGroups.productGroupTitle}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'تایید و حذف',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-trash',
        rejectLabel: 'انصراف',
        rejectButtonStyleClass: 'p-button-secondary',
        defaultFocus: 'reject',
        accept: () => this.deleteGroupProduct(this.selectedProductGroups.id, this.selectedProductGroups.productGroupTitle),
      });
    }, 100)
  }

  deleteGroupProduct(id: number, productGroupTitle: string) {
    this.httpService
      .delete<ProductGroup>(
        ProductGroup.deleteApiAddress + `/${id}`
      )
      .subscribe(response => {
        if (response.successed) {
          this.messageService.add({
            key: 'productGroupMessage',
            life: 8000,
            severity: 'success',
            detail: `شرکت ${productGroupTitle}`,
            summary: 'با موفقیت حذف شد',
          });
          this.getProductGroupList();
        }
      });
  }

}
