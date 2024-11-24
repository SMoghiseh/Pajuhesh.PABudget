import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYearActivityBreakComponent } from './add-edit-year-activity-break.component';

describe('AddEditYearActivityBreakComponent', () => {
  let component: AddEditYearActivityBreakComponent;
  let fixture: ComponentFixture<AddEditYearActivityBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditYearActivityBreakComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYearActivityBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
