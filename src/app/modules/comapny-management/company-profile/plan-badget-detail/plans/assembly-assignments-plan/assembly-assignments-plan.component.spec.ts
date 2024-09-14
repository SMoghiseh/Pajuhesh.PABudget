import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyAssignmentsPlanComponent } from './value.component';

describe('AssemblyAssignmentsPlanComponent', () => {
  let component: AssemblyAssignmentsPlanComponent;
  let fixture: ComponentFixture<AssemblyAssignmentsPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblyAssignmentsPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyAssignmentsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
