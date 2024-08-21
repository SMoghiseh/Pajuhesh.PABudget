import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyAssignmentsComponent } from './assembly-assignments.component';

describe('AssemblyAssignmentsComponent', () => {
  let component: AssemblyAssignmentsComponent;
  let fixture: ComponentFixture<AssemblyAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblyAssignmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
