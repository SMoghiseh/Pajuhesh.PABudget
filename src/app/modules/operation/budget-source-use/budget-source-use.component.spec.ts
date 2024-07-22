import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSourceUseComponent } from './budget-source-use.component';

describe('BudgetSourceUseComponent', () => {
  let component: BudgetSourceUseComponent;
  let fixture: ComponentFixture<BudgetSourceUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetSourceUseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetSourceUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
