import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPersonelNoComponent } from './add-edit-personel-no.component';

describe('AddEditPersonelNoComponent', () => {
  let component: AddEditPersonelNoComponent;
  let fixture: ComponentFixture<AddEditPersonelNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPersonelNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPersonelNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
