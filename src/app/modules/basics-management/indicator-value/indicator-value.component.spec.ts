import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorValueComponent } from './indicator-value.component';

describe('IndicatorValueComponent', () => {
  let component: IndicatorValueComponent;
  let fixture: ComponentFixture<IndicatorValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
