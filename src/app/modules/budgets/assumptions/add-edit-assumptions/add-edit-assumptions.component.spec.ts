import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAssumptionsComponent } from './add-edit-assumptions.component';

describe('AddEditAssumptionsComponent', () => {
  let component: AddEditAssumptionsComponent;
  let fixture: ComponentFixture<AddEditAssumptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAssumptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAssumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
