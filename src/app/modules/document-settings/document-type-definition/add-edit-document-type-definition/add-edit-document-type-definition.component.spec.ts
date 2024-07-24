import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumentTypeDefinitionComponent } from './add-edit-document-type-definition.component';

describe('AddEditDocumentTypeDefinitionComponent', () => {
  let component: AddEditDocumentTypeDefinitionComponent;
  let fixture: ComponentFixture<AddEditDocumentTypeDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDocumentTypeDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDocumentTypeDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
