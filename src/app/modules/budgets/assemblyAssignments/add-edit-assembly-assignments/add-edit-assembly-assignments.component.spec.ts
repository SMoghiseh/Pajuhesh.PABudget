import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAssemblyAssignmentsComponent } from './add-edit-assembly-assignments.component';

describe('AddEditAssemblyAssignmentsComponent', () => {
  let component: AddEditAssemblyAssignmentsComponent;
  let fixture: ComponentFixture<AddEditAssemblyAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAssemblyAssignmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAssemblyAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
