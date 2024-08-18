import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearGoalComponent } from './year-goal.component';

describe('YearGoalComponent', () => {
  let component: YearGoalComponent;
  let fixture: ComponentFixture<YearGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearGoalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
