import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialStatementsReportComponent } from './financial-statements-report.component';

describe('FinancialStatementsReportComponent', () => {
  let component: FinancialStatementsReportComponent;
  let fixture: ComponentFixture<FinancialStatementsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialStatementsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialStatementsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
