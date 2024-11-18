import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedIndicatorComponent } from './related-indicator.component';

describe('RelatedIndicatorComponent', () => {
  let component: RelatedIndicatorComponent;
  let fixture: ComponentFixture<RelatedIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
