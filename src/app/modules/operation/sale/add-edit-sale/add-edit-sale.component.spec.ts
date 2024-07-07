import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSaleComponent } from './add-edit-personel-no.component';

describe('AddEditSaleComponent', () => {
  let component: AddEditSaleComponent;
  let fixture: ComponentFixture<AddEditSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
