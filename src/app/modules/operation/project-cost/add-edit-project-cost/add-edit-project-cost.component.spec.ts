import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProjectCostComponent } from './add-edit-project-cost.component';

describe('AddEditProjectCostComponent', () => {
  let component: AddEditProjectCostComponent;
  let fixture: ComponentFixture<AddEditProjectCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProjectCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProjectCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
