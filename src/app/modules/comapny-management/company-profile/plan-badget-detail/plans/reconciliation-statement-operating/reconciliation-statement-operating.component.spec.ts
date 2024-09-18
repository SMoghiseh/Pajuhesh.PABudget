import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationStatementOperatingComponent } from './reconciliation-statement-operating.component';

describe('ReconciliationStatementOperatingComponent', () => {
  let component: ReconciliationStatementOperatingComponent;
  let fixture: ComponentFixture<ReconciliationStatementOperatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconciliationStatementOperatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconciliationStatementOperatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
