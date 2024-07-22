import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBudgetSourceUseComponent } from './add-edit-budget-source-use.component';

describe('AddEditBudgetSourceUseComponent', () => {
  let component: AddEditBudgetSourceUseComponent;
  let fixture: ComponentFixture<AddEditBudgetSourceUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditBudgetSourceUseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBudgetSourceUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
