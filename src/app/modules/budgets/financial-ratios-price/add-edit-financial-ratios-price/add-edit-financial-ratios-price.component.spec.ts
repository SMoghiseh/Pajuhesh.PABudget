import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFinancialRatiosPriceComponent } from './add-edit-financial-ratios-price.component';

describe('AddEditFinancialRatiosPriceComponent', () => {
  let component: AddEditFinancialRatiosPriceComponent;
  let fixture: ComponentFixture<AddEditFinancialRatiosPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFinancialRatiosPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditFinancialRatiosPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
