import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserRoleComponent } from './add-edit-user-role.component';

describe('AddEditUserRoleComponent', () => {
  let component: AddEditUserRoleComponent;
  let fixture: ComponentFixture<AddEditUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUserRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
