import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearRiskComponent } from './year-risk.component';

describe('YearRiskComponent', () => {
  let component: YearRiskComponent;
  let fixture: ComponentFixture<YearRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
