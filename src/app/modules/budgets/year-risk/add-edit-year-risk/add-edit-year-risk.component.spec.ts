import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYearRiskComponent } from './add-edit-year-risk.component';

describe('AddEditYearRiskComponent', () => {
  let component: AddEditYearRiskComponent;
  let fixture: ComponentFixture<AddEditYearRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditYearRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYearRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
