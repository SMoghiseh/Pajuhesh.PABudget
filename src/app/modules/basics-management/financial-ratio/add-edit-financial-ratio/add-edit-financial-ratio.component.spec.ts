import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFinancialRatioComponent } from './add-edit-financial-ratio.component';

describe('AddEditFinancialRatioComponent', () => {
  let component: AddEditFinancialRatioComponent;
  let fixture: ComponentFixture<AddEditFinancialRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFinancialRatioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditFinancialRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
