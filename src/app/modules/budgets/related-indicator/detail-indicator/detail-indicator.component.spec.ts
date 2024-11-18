import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIndicatorComponent } from './detail-indicator.component';

describe('DetailIndicatorComponent', () => {
  let component: DetailIndicatorComponent;
  let fixture: ComponentFixture<DetailIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
