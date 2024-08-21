import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYearGoalComponent } from './add-edit-year-goal.component';

describe('AddEditYearGoalComponent', () => {
  let component: AddEditYearGoalComponent;
  let fixture: ComponentFixture<AddEditYearGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditYearGoalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYearGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
