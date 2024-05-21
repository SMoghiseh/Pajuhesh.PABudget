import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodDefinitionComponent } from './period-definition.component';

describe('PeriodDefinitionComponent', () => {
  let component: PeriodDefinitionComponent;
  let fixture: ComponentFixture<PeriodDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
