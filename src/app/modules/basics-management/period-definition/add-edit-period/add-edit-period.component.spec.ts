import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPeriodComponent } from './add-edit-period.component';

describe('AddEditPeriodComponent', () => {
  let component: AddEditPeriodComponent;
  let fixture: ComponentFixture<AddEditPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
