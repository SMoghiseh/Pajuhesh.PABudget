import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearActivityComponent } from './year-activity.component';

describe('YearActivityComponent', () => {
  let component: YearActivityComponent;
  let fixture: ComponentFixture<YearActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
