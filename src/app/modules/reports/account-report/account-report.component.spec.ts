import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReportItemComponent } from './account-report.component';

describe('AccountReportItemComponent', () => {
  let component: AccountReportItemComponent;
  let fixture: ComponentFixture<AccountReportItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountReportItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
