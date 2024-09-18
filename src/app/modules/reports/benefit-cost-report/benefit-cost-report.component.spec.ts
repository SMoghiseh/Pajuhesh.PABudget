import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitCostReportComponent } from './benefit-cost-report.component';

describe('BenefitCostReportComponent', () => {
  let component: BenefitCostReportComponent;
  let fixture: ComponentFixture<BenefitCostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitCostReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
