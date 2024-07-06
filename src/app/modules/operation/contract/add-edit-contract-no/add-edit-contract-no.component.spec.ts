import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContractNoComponent } from './add-edit-contract-no.component';

describe('AddEditContractNoComponent', () => {
  let component: AddEditContractNoComponent;
  let fixture: ComponentFixture<AddEditContractNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditContractNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditContractNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
