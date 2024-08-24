import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAssemblyAssignmentsDetailsComponent } from './add-edit-assembly-assignments-details.component';

describe('AddEditAssemblyAssignmentsDetailsComponent', () => {
  let component: AddEditAssemblyAssignmentsDetailsComponent;
  let fixture: ComponentFixture<AddEditAssemblyAssignmentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAssemblyAssignmentsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAssemblyAssignmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
