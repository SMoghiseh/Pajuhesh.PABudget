import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorDefinitionComponent } from './add-edit-indicator-chart-value.component';

describe('IndicatorDefinitionComponent', () => {
  let component: IndicatorDefinitionComponent;
  let fixture: ComponentFixture<IndicatorDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
