import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyAssignmentsDetailsComponent } from './assembly-assignments-details.component';

describe('AssemblyAssignmentsDetailsComponent', () => {
  let component: AssemblyAssignmentsDetailsComponent;
  let fixture: ComponentFixture<AssemblyAssignmentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblyAssignmentsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyAssignmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
