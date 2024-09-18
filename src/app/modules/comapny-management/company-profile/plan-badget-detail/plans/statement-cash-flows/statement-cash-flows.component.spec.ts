import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementCashFlowsComponent } from './statement-cash-flows.component';

describe('StatementCashFlowsComponent', () => {
  let component: StatementCashFlowsComponent;
  let fixture: ComponentFixture<StatementCashFlowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementCashFlowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementCashFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
