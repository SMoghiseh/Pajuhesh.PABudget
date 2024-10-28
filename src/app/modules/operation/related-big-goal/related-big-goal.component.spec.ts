import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedBigGoalComponent } from './related-big-goal.component';

describe('RelatedBigGoalComponent', () => {
  let component: RelatedBigGoalComponent;
  let fixture: ComponentFixture<RelatedBigGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedBigGoalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedBigGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
