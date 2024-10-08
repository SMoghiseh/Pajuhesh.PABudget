import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShareHolderCompanyComponent } from './add-edit-share-holder-company.component';

describe('AddEditShareHolderCompanyComponent', () => {
  let component: AddEditShareHolderCompanyComponent;
  let fixture: ComponentFixture<AddEditShareHolderCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditShareHolderCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditShareHolderCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
