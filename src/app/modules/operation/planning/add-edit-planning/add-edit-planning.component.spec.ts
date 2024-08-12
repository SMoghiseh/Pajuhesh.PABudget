import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlanningComponent } from './add-edit-planning.component';

describe('AddEditPlanningComponent', () => {
  let component: AddEditPlanningComponent;
  let fixture: ComponentFixture<AddEditPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
