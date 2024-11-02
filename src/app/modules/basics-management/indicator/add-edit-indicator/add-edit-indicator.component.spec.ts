import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIndicatorComponent } from './add-edit-indicator.component';

describe('AddEditIndicatorComponent', () => {
  let component: AddEditIndicatorComponent;
  let fixture: ComponentFixture<AddEditIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
