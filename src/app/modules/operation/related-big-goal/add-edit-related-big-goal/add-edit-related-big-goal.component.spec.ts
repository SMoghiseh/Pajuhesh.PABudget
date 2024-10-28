import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRelatedBigGoalComponent } from './add-edit-related-big-goal.component';

describe('AddEditRelatedBigGoalComponent', () => {
  let component: AddEditRelatedBigGoalComponent;
  let fixture: ComponentFixture<AddEditRelatedBigGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRelatedBigGoalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRelatedBigGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
