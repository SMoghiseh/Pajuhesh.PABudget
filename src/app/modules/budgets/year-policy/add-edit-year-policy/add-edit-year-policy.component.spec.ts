import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYearPolicyComponent } from './add-edit-year-policy.component';

describe('AddEditYearPolicyComponent', () => {
  let component: AddEditYearPolicyComponent;
  let fixture: ComponentFixture<AddEditYearPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditYearPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYearPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
