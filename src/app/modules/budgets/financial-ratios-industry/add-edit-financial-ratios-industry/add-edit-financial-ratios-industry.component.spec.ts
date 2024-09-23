import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFinancialRatiosIndustryComponent } from './add-edit-financial-ratios-industry.component';

describe('AddEditFinancialRatiosIndustryComponent', () => {
  let component: AddEditFinancialRatiosIndustryComponent;
  let fixture: ComponentFixture<AddEditFinancialRatiosIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFinancialRatiosIndustryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditFinancialRatiosIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
