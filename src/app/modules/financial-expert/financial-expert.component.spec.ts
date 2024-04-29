/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialExpertComponent } from './financial-expert.component';

describe('FinancialExpertComponent', () => {
  let component: FinancialExpertComponent;
  let fixture: ComponentFixture<FinancialExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialExpertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
