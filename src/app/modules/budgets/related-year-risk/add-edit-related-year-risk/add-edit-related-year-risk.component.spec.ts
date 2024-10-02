import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRelatedYearRiskComponent } from './add-edit-related-year-risk.component';

describe('AddEditRelatedYearRiskComponent', () => {
  let component: AddEditRelatedYearRiskComponent;
  let fixture: ComponentFixture<AddEditRelatedYearRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRelatedYearRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRelatedYearRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
