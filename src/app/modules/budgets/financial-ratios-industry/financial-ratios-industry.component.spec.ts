import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRatiosIndustryComponent } from './financial-ratios-industry.component';

describe('FinancialRatiosIndustryComponent', () => {
  let component: FinancialRatiosIndustryComponent;
  let fixture: ComponentFixture<FinancialRatiosIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialRatiosIndustryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialRatiosIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
