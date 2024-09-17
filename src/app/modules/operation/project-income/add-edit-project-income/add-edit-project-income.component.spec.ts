import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProjectIncomeComponent } from './add-edit-project-income.component';

describe('AddEditProjectIncomeComponent', () => {
  let component: AddEditProjectIncomeComponent;
  let fixture: ComponentFixture<AddEditProjectIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProjectIncomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProjectIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
