import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetResourceUseComponent } from './budget-resource-use.component';

describe('BudgetResourceUseComponent', () => {
  let component: BudgetResourceUseComponent;
  let fixture: ComponentFixture<BudgetResourceUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetResourceUseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetResourceUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
