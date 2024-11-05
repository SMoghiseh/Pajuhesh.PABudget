 import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIndicatorValueComponent } from './add-edit-indicator-value.component';

describe('AddEditIndicatorValueComponent', () => {
  let component: AddEditIndicatorValueComponent;
  let fixture: ComponentFixture<AddEditIndicatorValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditIndicatorValueComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditIndicatorValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

