import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearActivityBreakComponent } from './year-activity-break.component';

describe('YearActivityBreakComponent', () => {
  let component: YearActivityBreakComponent;
  let fixture: ComponentFixture<YearActivityBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearActivityBreakComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearActivityBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
