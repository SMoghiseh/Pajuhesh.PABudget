

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionRoleAssignmentComponent } from './permission-role-assignment.component';

describe('PermissionRoleAssignmentComponent', () => {
  let component: PermissionRoleAssignmentComponent;
  let fixture: ComponentFixture<PermissionRoleAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermissionRoleAssignmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionRoleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
