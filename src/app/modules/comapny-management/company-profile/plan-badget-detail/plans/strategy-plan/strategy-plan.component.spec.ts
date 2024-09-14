import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyPlanComponent } from './strategy-plan.component';

describe('StrategyPlanComponent', () => {
  let component: StrategyPlanComponent;
  let fixture: ComponentFixture<StrategyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
