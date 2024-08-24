import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYearActivityComponent } from './add-edit-year-activity.component';

describe('AddEditYearActivityComponent', () => {
  let component: AddEditYearActivityComponent;
  let fixture: ComponentFixture<AddEditYearActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditYearActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYearActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
