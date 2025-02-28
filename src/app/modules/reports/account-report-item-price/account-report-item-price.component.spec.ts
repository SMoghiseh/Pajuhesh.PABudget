import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReportComponent } from './account-report-item-price.component';

describe('AccountReportComponent', () => {
  let component: AccountReportComponent;
  let fixture: ComponentFixture<AccountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
