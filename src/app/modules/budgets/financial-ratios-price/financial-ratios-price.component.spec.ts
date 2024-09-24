import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRatiosPriceComponent } from './financial-ratios-price.component';

describe('FinancialRatiosPriceComponent', () => {
  let component: FinancialRatiosPriceComponent;
  let fixture: ComponentFixture<FinancialRatiosPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialRatiosPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialRatiosPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
